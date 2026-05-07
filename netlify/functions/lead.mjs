/**
 * Netlify Function: /api/lead
 * Receives lead data from the chat widget or contact form
 * and sends a structured WhatsApp message via Meta WhatsApp Cloud API.
 *
 * ─── SETUP (one-time, ~10 minutes) ───────────────────────────────────────────
 *
 * STEP 1 — Create a Meta App
 *   1. Go to https://developers.facebook.com
 *   2. Click "My Apps" → "Create App"
 *   3. Choose type: "Business" → Next
 *   4. Give it a name (e.g. "Mirai Notifications") → Create App
 *
 * STEP 2 — Add WhatsApp to the app
 *   1. In your app dashboard, find "WhatsApp" in the product list → click "Set up"
 *   2. You'll land on the "API Setup" page
 *
 * STEP 3 — Get your Phone Number ID
 *   1. On the API Setup page, under "Send and receive messages"
 *   2. You'll see a test phone number — copy the "Phone number ID" (a long number)
 *      → this is your WHATSAPP_PHONE_ID
 *
 * STEP 4 — Add your personal number as a recipient
 *   1. Under the "To:" dropdown on the same page, click "Manage phone number list"
 *   2. Add your personal WhatsApp number (with country code, e.g. +14155551234)
 *   3. You'll receive a verification code on WhatsApp — enter it to confirm
 *
 * STEP 5 — Get a permanent access token
 *   1. In the top-left of developers.facebook.com, go to your Business → Settings
 *   2. Users → System Users → Add → give it a name, role: Employee → Create
 *   3. Click "Add Assets" → select your app → give "Full control"
 *   4. Click "Generate New Token" → select your app
 *   5. Enable permission: whatsapp_business_messaging → Generate token
 *   6. Copy the token → this is your WHATSAPP_ACCESS_TOKEN
 *   Note: This token does NOT expire.
 *
 * STEP 6 — Add env vars in Netlify dashboard → Site settings → Env variables:
 *   WHATSAPP_PHONE_ID      = the Phone Number ID from Step 3 (digits only)
 *   WHATSAPP_ACCESS_TOKEN  = the permanent token from Step 5
 *   WHATSAPP_RECIPIENT     = your personal WhatsApp number, digits only, no +
 *                            e.g. 14155551234 (US), 447911123456 (UK), 919876543210 (IN)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

const GRAPH_API_VERSION = 'v20.0';

function formatDateTime() {
  return new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  });
}

function buildChatbotMessage({ name, email, businessType, challenge }) {
  return [
    '🤖 *New Chat Lead — themiraitech.com*',
    '',
    `👤 *Name:* ${name || 'Not provided'}`,
    `📧 *Email:* ${email || 'Not provided'}`,
    `🏢 *Business:* ${businessType || 'Not specified'}`,
    `💬 *Challenge:* ${challenge || 'Not specified'}`,
    `📅 *Date:* ${formatDateTime()}`,
    `🌐 *Source:* AI Chat Widget`,
  ].join('\n');
}

function buildFormMessage({ name, email, company, website, budget, message }) {
  const budgetLabels = {
    'under-3k': 'Under $3,000',
    '3k-8k': '$3,000 – $8,000',
    '8k-15k': '$8,000 – $15,000',
    '15k-30k': '$15,000 – $30,000',
    '30k-plus': '$30,000+',
    'not-sure': 'Not sure yet',
  };
  return [
    '📬 *New Contact Form — themiraitech.com*',
    '',
    `👤 *Name:* ${name || '-'}`,
    `📧 *Email:* ${email || '-'}`,
    `🏢 *Company:* ${company || '-'}`,
    `🌐 *Website:* ${website || '-'}`,
    `💰 *Budget:* ${budgetLabels[budget] || budget || '-'}`,
    `💬 *Message:*\n${(message || '-').slice(0, 500)}`,
    '',
    `📅 *Date:* ${formatDateTime()}`,
  ].join('\n');
}

async function sendWhatsApp(messageText) {
  const phoneId   = process.env.WHATSAPP_PHONE_ID;
  const token     = process.env.WHATSAPP_ACCESS_TOKEN;
  const recipient = process.env.WHATSAPP_RECIPIENT;

  if (!phoneId || !token || !recipient) {
    // Log so you can see leads in Netlify function logs while env vars aren't set
    console.log('[lead] WhatsApp env vars not set. Lead received:\n', messageText);
    return;
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneId}/messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: recipient.replace(/\D/g, ''), // strip any non-digit chars just in case
      type: 'text',
      text: { body: messageText },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[lead] WhatsApp API error:', res.status, err);
  } else {
    console.log('[lead] WhatsApp message sent successfully.');
  }
}

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

  const text = data.source === 'chatbot'
    ? buildChatbotMessage(data)
    : buildFormMessage(data);

  await sendWhatsApp(text).catch(err => console.error('[lead] sendWhatsApp threw:', err));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
