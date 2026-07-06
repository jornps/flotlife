import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lang = z.enum(['en', 'no']);
const segmentKey = z.enum(['havbruk', 'industri', 'kommunal', 'maritim']);
const solutionKey = z.enum(['daf', 'screw-press', 'biological-treatment', 'containerized-plant']);

const statBlock = z.object({
  value: z.string(),
  label: z.string(),
});

const segments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/segments' }),
  schema: ({ image }) =>
    z.object({
      lang,
      segmentKey,
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      stats: z.array(statBlock).default([]),
      relatedSolutions: z.array(solutionKey).default([]),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      order: z.number().default(0),
    }),
});

const solutions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/solutions' }),
  schema: ({ image }) =>
    z.object({
      lang,
      solutionKey,
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      technicalDetails: z.string().optional(),
      applicableSegments: z.array(segmentKey).default([]),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      order: z.number().default(0),
    }),
});

export const collections = { segments, solutions };
