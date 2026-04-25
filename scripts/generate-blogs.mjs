/**
 * Daily blog generation script for Mirai AI Agency
 * Uses Groq (free tier) — requires GROQ_API_KEY env var.
 * Sign up free at groq.com — no credit card needed.
 * Generates 3–5 MDX blog posts and writes them to src/content/blog/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const POST_COUNT = Math.min(5, Math.max(3, parseInt(process.env.POST_COUNT || '3', 10)));
const TODAY = new Date().toISOString().split('T')[0];

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // Free, high quality

async function groq(systemPrompt, userPrompt, maxTokens = 1024) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

function getExistingSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return new Set();
  return new Set(
    fs.readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(f => f.replace(/\.(mdx|md)$/, ''))
  );
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function estimateReadingTime(content) {
  return Math.max(3, Math.round(content.split(/\s+/).length / 200));
}

async function generateTopics(existingSlugs, count) {
  const existingList = [...existingSlugs].slice(-20).join(', ') || 'none yet';

  const raw = await groq(
    `You generate blog topic ideas for Mirai, an AI automation agency targeting Western SMBs (US, UK, Canada, Australia) in law firms, real estate, dental clinics, e-commerce, and home services. Topics must be practical, specific, and immediately useful to non-technical business owners.`,
    `Generate ${count} distinct blog post topics for today (${TODAY}). Each must be different from: ${existingList}.

Return ONLY a JSON array — no explanation, no markdown fences:
[
  {
    "title": "How Dental Clinics Are Using AI to Recover $40,000 in Lost Revenue",
    "description": "One sentence description under 160 chars.",
    "category": "Industry Guides",
    "tags": ["Dental", "AI Voice Agents", "Revenue Recovery"],
    "slug": "dental-clinics-ai-revenue-recovery"
  }
]

Rules:
- Titles must be specific with a concrete outcome or number when possible
- Category must be one of: AI Automation, Industry Guides, Tutorials
- 2–4 tags per post
- Slugs must be URL-safe kebab-case, unique from: ${existingList}
- Vary industries and categories across all ${count} posts`
  );

  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array found in topics response:\n${raw}`);
  return JSON.parse(match[0]);
}

async function generatePostContent(topic) {
  return groq(
    `You are a senior content writer for an AI automation agency. You write clear, authoritative blog posts for non-technical SMB owners (law firms, real estate, dental, e-commerce, home services) in the US, UK, Canada, and Australia.

Style rules:
- Direct, confident, zero fluff
- Real numbers and specific scenarios
- Short paragraphs (2–4 sentences)
- H2 and H3 headers throughout
- At least one practical example or mini case study
- End with 2–3 concrete next steps
- Expert peer tone, not salesman
- Never use "In this article", "In conclusion", or "delve"`,
    `Write a publish-ready blog post for:

Title: ${topic.title}
Category: ${topic.category}
Description: ${topic.description}

Requirements:
- 700–1000 words
- Plain markdown only (no JSX, no code fences wrapping the whole post)
- Start directly with the opening paragraph — no title heading
- ## for H2, ### for H3
- **bold** for key terms
- Bullet lists only when genuinely list-like
- End with actionable next steps

Return ONLY the blog body markdown.`,
    4096
  );
}

function buildMdx(topic, body) {
  return `---
title: "${topic.title.replace(/"/g, '\\"')}"
description: "${topic.description.replace(/"/g, '\\"')}"
pubDate: ${TODAY}
author: "Mirai Team"
category: "${topic.category}"
tags: ${JSON.stringify(topic.tags)}
readingTime: ${estimateReadingTime(body)}
featured: false
draft: false
---

${body}
`;
}

async function run() {
  console.log(`Generating ${POST_COUNT} blog posts for ${TODAY} using Groq (free)…`);

  if (!process.env.GROQ_API_KEY) {
    console.error('Error: GROQ_API_KEY is not set.');
    console.error('Get a free key at groq.com → API Keys');
    process.exit(1);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  const existingSlugs = getExistingSlugs();
  console.log(`${existingSlugs.size} existing posts found`);

  const topics = await generateTopics(existingSlugs, POST_COUNT);
  console.log(`Got ${topics.length} topics\n`);

  for (const topic of topics) {
    let slug = topic.slug || slugify(topic.title);
    if (existingSlugs.has(slug)) slug = `${slug}-${TODAY}`;

    console.log(`Generating: "${topic.title}"`);
    const body = await generatePostContent(topic);
    const mdx = buildMdx({ ...topic, slug }, body);

    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    fs.writeFileSync(filePath, mdx, 'utf-8');
    console.log(`  ✓ ${slug}.mdx`);

    existingSlugs.add(slug);

    // Groq free tier: stay well under rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\nDone. ${topics.length} posts written.`);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
