/**
 * Netlify Function: /api/chat
 * Proxies Groq LLM requests for the Nova chat widget.
 * Keeps GROQ_API_KEY server-side — never exposed to the browser.
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are Nova, a friendly AI assistant for Mirai — an AI automation agency that builds voice agents, workflow automation, chatbots, and lead generation systems for small businesses.

RULES:
- Keep ALL responses to 1-3 short sentences max. Be conversational, not corporate.
- Never mention pricing unless the visitor asks directly.
- Your goal: understand their business situation and warm them up for a free strategy call.
- Ask ONE question at a time. Never ask multiple questions in one message.
- Be genuinely helpful, not salesy.

MIRAI SERVICES (mention only when clearly relevant):
- AI Voice Agents: Answer every call 24/7, qualify leads, book appointments automatically
- Workflow Automation: Eliminate manual/repetitive tasks between tools (CRM, email, docs)
- AI Chatbots: Custom AI trained on their business data, deployed on website or WhatsApp
- AI Lead Generation: Automated prospecting and outreach to fill their pipeline

BEST FIT INDUSTRIES: law firms, dental clinics, real estate agencies, e-commerce brands, home services (HVAC, plumbing, cleaning etc.)

CONVERSATION FLOW:
1. Ask what type of business they run
2. Ask what their biggest operational challenge is
3. Briefly connect it to the most relevant Mirai service (1 sentence)
4. Tell them the team can help and they can drop their details below for a free call

When you're ready to prompt them to share their info, end your message naturally with something like: "Want me to have someone from the team reach out? You can drop your details in the form below."`;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Chat service not configured.' }) };
  }

  let messages;
  try {
    ({ messages } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Messages array required.' }) };
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 180,
        temperature: 0.7,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-12), // keep last 12 messages for context window
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Groq API error:', res.status, err);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Sorry, I'm having a little trouble right now. You can reach us directly at hello@themiraitech.com and we'll get back to you within 24 hours!",
        }),
      };
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Let me get someone from the team to follow up with you directly.";

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply }),
    };
  } catch (err) {
    console.error('Chat function error:', err);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Something went wrong on my end. Drop us a line at hello@themiraitech.com and we'll be in touch!",
      }),
    };
  }
};
