/**
 * Netlify Function: /api/test-whatsapp
 * Diagnostic endpoint — call this to verify your WhatsApp env vars are correct.
 * Returns the raw Meta API response so you can see any errors.
 *
 * Usage: visit https://themiraitech.com/api/test-whatsapp in your browser (GET request)
 * or curl https://themiraitech.com/api/test-whatsapp
 *
 * DELETE this file once WhatsApp is confirmed working.
 */

const GRAPH_API_VERSION = 'v20.0';

export const handler = async (event) => {
  const phoneId   = process.env.WHATSAPP_PHONE_ID;
  const token     = process.env.WHATSAPP_ACCESS_TOKEN;
  const recipient = process.env.WHATSAPP_RECIPIENT;

  // Show which env vars are set (never expose the token value itself)
  const envCheck = {
    WHATSAPP_PHONE_ID:     phoneId     ? `✅ set (value: ${phoneId})`     : '❌ NOT SET',
    WHATSAPP_ACCESS_TOKEN: token       ? `✅ set (length: ${token.length} chars)` : '❌ NOT SET',
    WHATSAPP_RECIPIENT:    recipient   ? `✅ set (value: ${recipient})`    : '❌ NOT SET',
  };

  if (!phoneId || !token || !recipient) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing env vars', envCheck }, null, 2),
    };
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneId}/messages`;

  let metaStatus, metaBody;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient.replace(/\D/g, ''),
        type: 'text',
        text: { body: '🧪 Test message from themiraitech.com — WhatsApp integration is working!' },
      }),
    });

    metaStatus = res.status;
    metaBody = await res.json();
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'fetch threw', message: String(err), envCheck }, null, 2),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metaApiStatus: metaStatus,
      metaApiResponse: metaBody,
      envCheck,
      success: metaStatus === 200,
    }, null, 2),
  };
};
