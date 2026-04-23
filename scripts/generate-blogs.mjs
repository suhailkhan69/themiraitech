/**
 * Daily blog generation script for Mirai AI Agency
 * Called by GitHub Actions — requires ANTHROPIC_API_KEY env var.
 * Generates 3–5 MDX blog posts and writes them to src/content/blog/.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const POST_COUNT = Math.min(5, Math.max(3, parseInt(process.env.POST_COUNT || '3', 10)));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATEGORIES = ['AI Automation', 'Industry Guides', 'Tutorials', 'AI Automation', 'Industry Guides'];
const TODAY = new Date().toISOString().split('T')[0];

// Load existing slugs so we never duplicate
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
  const words = content.split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}

async function generateTopics(existingSlugs, count) {
  const existingList = [...existingSlugs].slice(-20).join(', ') || 'none yet';

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    system: `You generate blog topic ideas for Mirai, an AI automation agency targeting Western SMBs (US, UK, Canada, Australia) in law firms, real estate, dental clinics, e-commerce, and home services. Topics must be practical, specific, and immediately useful to non-technical business owners. Vary between these categories: AI Automation, Industry Guides, Tutorials.`,
    messages: [
      {
        role: 'user',
        content: `Generate ${count} distinct blog post topics for today (${TODAY}). Each must be different from recent posts: ${existingList}.

Return ONLY a JSON array like:
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
- Titles must be specific and include a concrete outcome or number when possible
- Categories must be one of: AI Automation, Industry Guides, Tutorials
- 2–4 tags per post
- Slugs must be URL-safe, unique from: ${existingList}
- Vary industries and categories across the ${count} posts`
      }
    ]
  });

  const raw = response.content[0].text;
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Claude did not return valid JSON array for topics');
  return JSON.parse(match[0]);
}

async function generatePostContent(topic) {
  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    system: `You are a senior content writer for Mirai, an AI automation agency. You write clear, authoritative blog posts for non-technical SMB owners (law firms, real estate, dental, e-commerce, home services) in the US, UK, Canada, and Australia.

Writing style:
- Direct, confident, no fluff
- Use real numbers and specific scenarios
- Short paragraphs (2–4 sentences max)
- Use H2 and H3 headers to structure content
- Include at least one practical example or mini case study
- End with a clear takeaway or next step
- Tone: expert peer, not salesman
- Do NOT mention Mirai by name in the body (only the author byline is fine)
- Do NOT use phrases like "In this article" or "In conclusion"`,
    messages: [
      {
        role: 'user',
        content: `Write a complete, publish-ready blog post for:

Title: ${topic.title}
Category: ${topic.category}
Description: ${topic.description}

Requirements:
- 700–1100 words
- MDX-compatible markdown (no JSX components, just standard markdown)
- Start directly with the first paragraph — no title heading (it's in frontmatter)
- Use ## for H2, ### for H3
- Bold key terms with **bold**
- Use bullet lists sparingly (only when genuinely list-like)
- Include a concrete example with a realistic business scenario
- End with 2–3 actionable steps the reader can take today

Return ONLY the blog post body in markdown. No frontmatter, no code fences around the whole thing.`
      }
    ]
  });

  return response.content[0].text.trim();
}

function buildMdx(topic, body) {
  const readingTime = estimateReadingTime(body);
  const tags = JSON.stringify(topic.tags);

  return `---
title: "${topic.title.replace(/"/g, '\\"')}"
description: "${topic.description.replace(/"/g, '\\"')}"
pubDate: ${TODAY}
author: "Mirai Team"
category: "${topic.category}"
tags: ${tags}
readingTime: ${readingTime}
featured: false
draft: false
---

${body}
`;
}

async function run() {
  console.log(`Generating ${POST_COUNT} blog posts for ${TODAY}…`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const existingSlugs = getExistingSlugs();
  console.log(`Found ${existingSlugs.size} existing posts`);

  const topics = await generateTopics(existingSlugs, POST_COUNT);
  console.log(`Got ${topics.length} topics from Claude`);

  for (const topic of topics) {
    // Ensure slug is unique
    let slug = topic.slug || slugify(topic.title);
    if (existingSlugs.has(slug)) {
      slug = `${slug}-${TODAY}`;
    }

    console.log(`\nGenerating: "${topic.title}"`);
    const body = await generatePostContent(topic);
    const mdx = buildMdx({ ...topic, slug }, body);

    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    fs.writeFileSync(filePath, mdx, 'utf-8');
    console.log(`  Written → ${filePath}`);

    existingSlugs.add(slug);

    // Brief pause to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\nDone. ${topics.length} posts written.`);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
