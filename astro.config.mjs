import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://themiraitech.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/contact/success'),
      serialize(item) {
        const url = item.url;
        if (url === 'https://themiraitech.com/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (url.includes('/services')) {
          item.priority = 0.95;
          item.changefreq = 'monthly';
        } else if (url.includes('/solutions')) {
          item.priority = 0.9;
          item.changefreq = 'monthly';
        } else if (url.includes('/blog/') && !url.endsWith('/blog/')) {
          item.priority = 0.75;
          item.changefreq = 'monthly';
        } else if (url.endsWith('/blog/') || url.endsWith('/blog')) {
          item.priority = 0.85;
          item.changefreq = 'daily';
        } else if (url.includes('/case-studies')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (url.includes('/contact')) {
          item.priority = 0.85;
          item.changefreq = 'monthly';
        } else if (url.includes('/about')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.5;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
    react(),
  ],
});
