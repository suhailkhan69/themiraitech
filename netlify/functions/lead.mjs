/**
 * Netlify Function: /api/lead
 * Receives lead data from the chat widget or contact form
 * and sends a structured WhatsApp notification via CallMeBot.
 *
 * SETUP (one-time, takes 2 minutes):
 * 1. Save +34 644 48 19 02 in your contacts as "CallMeBot"
 * 2. Send the message: "I allow callmebot to send me messages"
 *    to that number on WhatsApp
 * 3. You'll receive your API key via WhatsApp within seconds
 * 4. In Netlify dashboard → Site settings → Environment variables, add:
 *    WHATSAPP_PHONE  = your WhatsApp number (international, no + or spaces)
 *                      e.g. 14155551234 for US, 447911123456 for UK
 *    WHATSAPP_APIKEY = the API key CallMeBot sent you
 */

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
    `🏢 *Business type:* ${businessType || 'Not specified'}`,
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
    `💬 *Message:*\n${(message || '-').slice(0, 400)}`,
    '',
    `📅 *Date:* ${formatDateTime()}`,
  ].join('\n');
}

async function sendWhatsApp(text) {
  const phone = process.env.WHATSAPP_PHONE;
  const apiKey = process.env.WHATSAPP_APIKEY;

  if (!phone || !apiKey) {
    console.log('[lead] WhatsApp not configured. Lead data:\n', text);
    return;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('[lead] CallMeBot error:', res.status, await res.text());
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

  await sendWhatsApp(text).catch(err => console.error('[lead] sendWhatsApp failed:', err));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
