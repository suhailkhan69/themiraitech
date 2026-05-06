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
const MODEL = 'llama-3.3-70b-versatile';

async function groq(systemPrompt, userPrompt, maxTokens = 1024, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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

      if (res.status === 429) {
        const waitMs = attempt * 10000;
        console.log(`  Rate limited (429). Waiting ${waitMs / 1000}s before retry ${attempt}/${retries}…`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Groq API error ${res.status}: ${err}`);
      }

      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const waitMs = attempt * 5000;
        console.log(`  API call failed (attempt ${attempt}/${retries}): ${err.message}. Retrying in ${waitMs / 1000}s…`);
        await new Promise(r => setTimeout(r, waitMs));
      }
    }
  }
  throw lastError;
}

function getExistingSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return new Set();
  return new Set(
    fs.readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(f => f.replace(/\.(mdx|md)$/, ''))
  );
}

function getExistingTitles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => {
      try {
        const content = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
        const match = content.match(/^title:\s*"(.+?)"/m);
        return match ? match[1] : '';
      } catch { return ''; }
    })
    .filter(Boolean);
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

async function generateTopics(existingSlugs, existingTitles, count) {
  const slugList = [...existingSlugs].slice(-30).join(', ') || 'none yet';
  const titleList = existingTitles.slice(-20).join(' | ') || 'none yet';

  const raw = await groq(
    `You generate blog topic ideas for Mirai, an AI automation agency targeting Western SMBs (US, UK, Canada, Australia) in law firms, real estate, dental clinics, e-commerce, and home services. Topics must be practical, specific, and immediately useful to non-technical business owners.`,
    `Generate ${count} DISTINCT blog post topics for today (${TODAY}).

ALREADY PUBLISHED TITLES (do NOT repeat or closely paraphrase any of these):
${titleList}

Return ONLY a JSON array — no explanation, no markdown fences:
[
  {
    "title": "How Dental Clinics Are Using AI to Recover $40,000 in Lost Revenue",
    "description": "Discover the specific AI workflows that help dental practices automatically follow up on missed appointments, recover lapsed patients, and collect outstanding balances — without adding staff.",
    "category": "Industry Guides",
    "tags": ["Dental", "AI Voice Agents", "Revenue Recovery"],
    "slug": "dental-clinics-ai-revenue-recovery"
  }
]

Rules:
- Titles must be specific with a concrete outcome, industry, or number
- Descriptions must be 100–160 characters and genuinely describe the article value
- Category must be EXACTLY one of: AI Automation, Industry Guides, Tutorials
- 2–4 tags per post
- Slugs: URL-safe kebab-case, unique from existing slugs: ${slugList}
- Vary industries and categories — cover different industries in each batch`
  );

  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array found in topics response:\n${raw}`);
  const topics = JSON.parse(match[0]);

  // Validate category enum to avoid Astro build errors
  const validCategories = new Set(['AI Automation', 'Case Studies', 'Industry Guides', 'Tutorials']);
  for (const t of topics) {
    if (!validCategories.has(t.category)) {
      console.warn(`  Warning: invalid category "${t.category}" — defaulting to "AI Automation"`);
      t.category = 'AI Automation';
    }
  }

  return topics;
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
  const existingTitles = getExistingTitles();
  console.log(`${existingSlugs.size} existing posts found`);

  let topics;
  try {
    topics = await generateTopics(existingSlugs, existingTitles, POST_COUNT);
  } catch (err) {
    console.error(`Failed to generate topics: ${err.message}`);
    process.exit(1);
  }
  console.log(`Got ${topics.length} topics\n`);

  let written = 0;
  for (const topic of topics) {
    let slug = topic.slug || slugify(topic.title);
    if (existingSlugs.has(slug)) slug = `${slug}-${TODAY}`;

    console.log(`Generating: "${topic.title}"`);
    try {
      const body = await generatePostContent(topic);
      const mdx = buildMdx({ ...topic, slug }, body);

      const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
      fs.writeFileSync(filePath, mdx, 'utf-8');
      console.log(`  ✓ ${slug}.mdx`);

      existingSlugs.add(slug);
      written++;
    } catch (err) {
      console.error(`  ✗ Failed to generate "${topic.title}": ${err.message}`);
    }

    // Groq free tier: stay well under rate limits
    await new Promise(r => setTimeout(r, 3000));
  }

  if (written === 0) {
    console.error('No posts were written. Exiting with error so the workflow reports failure.');
    process.exit(1);
  }

  console.log(`\nDone. ${written}/${topics.length} posts written.`);
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
