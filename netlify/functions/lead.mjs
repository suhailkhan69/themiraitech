/**
 * Netlify Function: /api/lead
 * Receives lead data from the chat widget or contact form.
 * Runs three actions in parallel:
 *   1. Appends a row to a Google Sheet
 *   2. Sends a Telegram notification
 *   3. Sends a WhatsApp notification (existing — optional)
 *
 * ─── SETUP GUIDE ─────────────────────────────────────────────────────────────
 *
 * ── GOOGLE SHEETS ────────────────────────────────────────────────────────────
 *
 * STEP 1 — Create the Google Sheet
 *   1. Go to sheets.google.com → create a new sheet
 *   2. Rename the first tab to "Leads"
 *   3. In row 1, add these headers (A1 to J1):
 *      Timestamp | Source | Name | Email | Company | Website | Budget | Message | Business Type | Conversation
 *   4. Copy the Sheet ID from the URL:
 *      https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
 *      → save as GOOGLE_SHEETS_SPREADSHEET_ID
 *
 * STEP 2 — Create a Service Account
 *   1. Go to console.cloud.google.com → create a new project (or use existing)
 *   2. Enable "Google Sheets API" (APIs & Services → Library → search "Sheets")
 *   3. Go to APIs & Services → Credentials → Create Credentials → Service Account
 *   4. Give it a name (e.g. "mirai-leads") → Create and Continue → Done
 *   5. Click the service account → Keys tab → Add Key → JSON → Create
 *   6. A JSON file downloads — open it and copy:
 *      "client_email"  → GOOGLE_SERVICE_ACCOUNT_EMAIL
 *      "private_key"   → GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 *        (copy the full key including -----BEGIN/END PRIVATE KEY-----)
 *
 * STEP 3 — Share the Sheet with the service account
 *   1. Open your Google Sheet
 *   2. Click Share → paste the service account email → Editor → Send
 *
 * ── TELEGRAM ─────────────────────────────────────────────────────────────────
 *
 * STEP 1 — Create a bot
 *   1. Open Telegram → search @BotFather → /start → /newbot
 *   2. Give it a name and username → copy the token
 *      → save as TELEGRAM_BOT_TOKEN
 *
 * STEP 2 — Get your Chat ID
 *   Option A (personal): Message your bot, then visit:
 *     https://api.telegram.org/bot<TOKEN>/getUpdates
 *     Look for "chat":{"id": 123456789} → save as TELEGRAM_CHAT_ID
 *   Option B (group/channel): Add the bot to your group as admin, send a message,
 *     then use getUpdates to find the group chat ID (will be negative, e.g. -1001234567)
 *
 * ── WHATSAPP (existing — optional) ──────────────────────────────────────────
 *   WHATSAPP_PHONE_ID      — Phone Number ID from Meta developer console
 *   WHATSAPP_ACCESS_TOKEN  — Permanent system user token
 *   WHATSAPP_RECIPIENT     — Recipient number, digits only (e.g. 14155551234)
 *
 * ── ADD ALL ENV VARS IN NETLIFY ──────────────────────────────────────────────
 *   Netlify Dashboard → Your site → Site configuration → Environment variables
 *   Add each key/value. For GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, paste the full
 *   private key exactly as-is from the JSON file (Netlify handles multiline).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSign } from 'crypto';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatDateTime() {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  });
}

const BUDGET_LABELS = {
  'under-3k': 'Under $3,000',
  '3k-8k': '$3,000 – $8,000',
  '8k-15k': '$8,000 – $15,000',
  '15k-30k': '$15,000 – $30,000',
  '30k-plus': '$30,000+',
  'not-sure': 'Not sure yet',
};

// ─── GOOGLE SHEETS ────────────────────────────────────────────────────────────

function buildJWT(email, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(privateKey, 'base64url');
  return `${signingInput}.${signature}`;
}

async function getAccessToken(email, privateKey) {
  const jwt = buildJWT(email, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function appendToSheet(row) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const email         = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey        = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!spreadsheetId || !email || !rawKey) {
    console.log('[lead] Google Sheets env vars not set — skipping sheet write.');
    return;
  }

  // Netlify stores multiline vars with literal \n — convert them back
  const privateKey = rawKey.replace(/\\n/g, '\n');

  const token = await getAccessToken(email, privateKey);

  const range = 'Leads!A:J';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sheets API ${res.status}: ${err}`);
  }

  console.log('[lead] Row appended to Google Sheet.');
}

// ─── TELEGRAM ─────────────────────────────────────────────────────────────────

async function sendTelegram(text) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('[lead] Telegram env vars not set — skipping.');
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API ${res.status}: ${err}`);
  }

  console.log('[lead] Telegram message sent.');
}

// ─── WHATSAPP (existing) ──────────────────────────────────────────────────────

async function sendWhatsApp(text) {
  const phoneId   = process.env.WHATSAPP_PHONE_ID;
  const token     = process.env.WHATSAPP_ACCESS_TOKEN;
  const recipient = process.env.WHATSAPP_RECIPIENT;

  if (!phoneId || !token || !recipient) {
    console.log('[lead] WhatsApp env vars not set — skipping.');
    return;
  }

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: recipient.replace(/\D/g, ''),
      type: 'text',
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API ${res.status}: ${err}`);
  }

  console.log('[lead] WhatsApp message sent.');
}

// ─── MESSAGE BUILDERS ─────────────────────────────────────────────────────────

function buildChatbotNotification({ name, email, businessType, challenge }) {
  return [
    '🤖 *New Chat Lead — themiraitech.com*',
    '',
    `👤 *Name:* ${name || 'Not provided'}`,
    `📧 *Email:* ${email || 'Not provided'}`,
    `🏢 *Business:* ${businessType || 'Not specified'}`,
    `💬 *Challenge:* ${challenge || 'Not specified'}`,
    `📅 *Time:* ${formatDateTime()}`,
    `🌐 *Source:* Chat Widget`,
  ].join('\n');
}

function buildFormNotification({ name, email, company, website, budget, message }) {
  return [
    '📬 *New Contact Form — themiraitech.com*',
    '',
    `👤 *Name:* ${name || '-'}`,
    `📧 *Email:* ${email || '-'}`,
    `🏢 *Company:* ${company || '-'}`,
    `🌐 *Website:* ${website || '-'}`,
    `💰 *Budget:* ${BUDGET_LABELS[budget] || budget || '-'}`,
    `💬 *Message:*\n${(message || '-').slice(0, 500)}`,
    '',
    `📅 *Time:* ${formatDateTime()}`,
  ].join('\n');
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON.' }) };
  }

  const isChatbot = data.source === 'chatbot';
  const notificationText = isChatbot
    ? buildChatbotNotification(data)
    : buildFormNotification(data);

  // Build the Google Sheets row
  // Columns: Timestamp | Source | Name | Email | Company | Website | Budget | Message | Business Type | Conversation
  const sheetRow = isChatbot
    ? [
        formatDateTime(),
        'Chat Widget',
        data.name || '',
        data.email || '',
        '',                                      // company (not collected by chatbot)
        '',                                      // website
        '',                                      // budget
        data.challenge || '',
        data.businessType || '',
        (data.conversation || '').slice(0, 1000),
      ]
    : [
        formatDateTime(),
        'Contact Form',
        data.name || '',
        data.email || '',
        data.company || '',
        data.website || '',
        BUDGET_LABELS[data.budget] || data.budget || '',
        (data.message || '').slice(0, 1000),
        '',   // businessType
        '',   // conversation
      ];

  // Fire all three in parallel — failures in one don't block the others
  const results = await Promise.allSettled([
    appendToSheet(sheetRow),
    sendTelegram(notificationText),
    sendWhatsApp(notificationText),
  ]);

  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const names = ['Sheets', 'Telegram', 'WhatsApp'];
      console.error(`[lead] ${names[i]} failed:`, r.reason?.message ?? r.reason);
    }
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
