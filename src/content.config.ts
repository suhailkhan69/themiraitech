import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Mirai Team'),
    authorImage: z.string().optional(),
    category: z.enum(['AI Automation', 'Case Studies', 'Industry Guides', 'Tutorials']),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    readingTime: z.number().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    challenge: z.string(),
    result: z.string(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      change: z.string().optional(),
    })),
    services: z.array(z.string()),
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
    }).optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    pubDate: z.date(),
  }),
});

export const collections = { blog, 'case-studies': caseStudies };
