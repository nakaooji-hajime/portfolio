import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const works = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      summary: z.string(),
      company: z.string(),
      role: z.string(),
      period: z.string(),
      category: z.string(),
      order: z.number(),
      featured: z.boolean(),
      provisional: z.boolean(),
      thumbnail: image(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
});

export const collections = { works };
