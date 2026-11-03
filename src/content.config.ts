import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const works = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      company: z.string(),
      role: z.string(),
      period: z.string(),
      order: z.number(),
      featured: z.boolean(),
      thumbnail: image(),
      screenshot: image().optional(),
      figma: z.url().optional(),
      website: z.url().optional(),
    }),
});

export const collections = { works };
