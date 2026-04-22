# Mirai — AI Agency Website

The official website for **Mirai** (themiraitech.com), an AI automation agency serving Western SMBs with voice agents, workflow automation, and custom AI systems.

## Tech Stack

- **Framework:** Astro 6 (static output)
- **Styling:** Tailwind CSS v3 (PostCSS)
- **Language:** TypeScript
- **Content:** Astro Content Collections (blog + case studies as MDX)
- **Forms:** Netlify Forms
- **Fonts:** Inter (body) + Space Grotesk (headings) via @fontsource
- **Deployment:** Netlify

---

## Running Locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

```bash
npm run build    # Build static site to dist/
npm run preview  # Preview the built site
```

---

## Adding a Blog Post

1. Create a new `.mdx` file in `src/content/blog/`:

```
src/content/blog/your-post-slug.mdx
```

2. Add the required frontmatter at the top:

```mdx
---
title: "Your Post Title"
description: "A 1–2 sentence summary shown in cards and meta tags."
pubDate: 2025-12-15
author: "Mirai Team"
category: "AI Automation"
tags: ["tag1", "tag2"]
readingTime: 8
featured: false
draft: false
---

Your MDX content here. You can use standard Markdown plus JSX components.

## Headings appear in the table of contents

Regular paragraphs, **bold**, _italic_, [links](https://example.com).

> Blockquotes work too.

| Column 1 | Column 2 |
|----------|----------|
| Cell     | Cell     |
```

3. **Categories** must be one of: `AI Automation`, `Case Studies`, `Industry Guides`, `Tutorials`

4. Set `draft: true` to hide a post from the published site.

5. The post will automatically appear at `/blog/your-post-slug`.

**Note on MDX:** Avoid bare `<` characters in table cells (use `&lt;` instead) — the MDX parser treats `<` as the start of a JSX element.

---

## Adding a Case Study

1. Create a new `.mdx` file in `src/content/case-studies/`:

```
src/content/case-studies/client-name.mdx
```

2. Add frontmatter:

```mdx
---
title: "How Client X Achieved Result Y"
client: "Client Name"
industry: "Real Estate"
challenge: "One sentence describing the client's main problem."
result: "Primary result achieved."
metrics:
  - label: "Qualified leads/month"
    value: "342%"
    change: "increase"
  - label: "Annual savings"
    value: "$96,000"
  - label: "Deployment time"
    value: "6 weeks"
services:
  - "AI Voice Agents"
  - "Workflow Automation"
testimonial:
  quote: "The client quote goes here."
  author: "Jane Smith"
  role: "CEO, Client Name"
featured: false
pubDate: 2025-12-01
---

## The Challenge

Narrative content in MDX...
```

3. The case study will appear at `/case-studies/client-name`.

---

## Deploying to Netlify

### Option 1: Connect GitHub repo (recommended)

1. Push your code to a GitHub repository
2. Log into [app.netlify.com](https://app.netlify.com)
3. Click **Add new site → Import an existing project**
4. Select GitHub and authorize
5. Choose your repository
6. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click **Deploy site**

Every push to `main` will trigger an automatic deploy.

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

---

## Connecting the GoDaddy Domain (themiraitech.com)

### Method A: Nameserver method (recommended — easiest)

This gives Netlify full DNS control. GoDaddy becomes just the registrar.

1. In Netlify: **Site settings → Domain management → Add custom domain**
2. Enter `themiraitech.com` → confirm
3. Click **Set up Netlify DNS** → Netlify will show you 4 nameserver addresses (e.g., `dns1.p03.nsone.net`)
4. In GoDaddy: go to your domain → **DNS → Nameservers → Change**
5. Select **Custom** and enter the 4 Netlify nameserver addresses
6. Wait 5–30 minutes for propagation
7. Netlify automatically provisions an SSL certificate via Let's Encrypt

### Method B: A record + CNAME (keep GoDaddy DNS)

Use this if you need to keep other services (email, subdomains) on GoDaddy DNS.

1. In Netlify: **Site settings → Domain management → Add custom domain** → enter `themiraitech.com`
2. Note your Netlify site's IP address (shown in the domain panel, or run `dig your-site.netlify.app A`)
3. In GoDaddy DNS, add/update these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | `75.2.60.5` | 600 |
| CNAME | www | `your-site.netlify.app` | 600 |

4. Use Netlify's load balancer IP (`75.2.60.5`) — not a specific server IP
5. Wait up to 48 hours for DNS propagation (usually <30 min)
6. In Netlify: verify the domain is connected, then **Force HTTPS**

---

## Environment Variables

This site is fully static and doesn't require any environment variables at build time.

If you add analytics, CRM webhooks, or other integrations later, set environment variables in:
**Netlify → Site settings → Environment variables**

---

## Assumptions & Notes

- **Placeholder content:** The About page has placeholder founder bio text (marked clearly). Replace before launch.
- **Calendar booking:** The contact page has a placeholder for Cal.com/Calendly. Add your actual booking link in `src/pages/contact/index.astro`.
- **Client logos:** The logo strip on the homepage uses text placeholders. Replace with actual `<img>` tags when you have client logo files.
- **OG image:** A default OG image placeholder is needed at `public/og-default.png` (1200×630px). The current placeholder is missing — create one before launch.
- **Email links:** Update `hello@themiraitech.com` and `privacy@themiraitech.com` in Footer and contact pages.
- **Social links:** Footer social links point to `https://linkedin.com` etc. — update to your actual profile URLs.
- **Tailwind config:** Uses Tailwind v3 with PostCSS (`postcss.config.mjs` + `tailwind.config.mjs`). Upgrade to Tailwind v4 when `@tailwindcss/vite` adds Vite 8 support.
- **Netlify Forms:** The contact form uses `data-netlify="true"` and will be captured automatically by Netlify on deploy. Test the form after first deployment.
