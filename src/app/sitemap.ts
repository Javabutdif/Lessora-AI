import type { MetadataRoute } from 'next';
import openAIService from '@/lib/services/openai.service';
import { connectionReady } from '@/lib/db';

export const revalidate = 3600;

const SITE_URL = process.env.PUBLIC_APP_URL || 'https://lessora.ajgenabio.me';

// Bump when the content of these pages actually changes; a fresh date on every build tells crawlers nothing
const STATIC_CONTENT_UPDATED = new Date('2026-10-02T00:00:00+08:00');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let planRoutes: MetadataRoute.Sitemap = [];
  let newestPlanDate = STATIC_CONTENT_UPDATED;

  try {
    await Promise.race([
      connectionReady,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB connection timed out')), 15_000)
      ),
    ]);
    const plans = await openAIService.listPublicLessonPlans();
    planRoutes = plans.map((plan) => {
      const lastModified = new Date(plan.updatedAt || plan.createdAt || STATIC_CONTENT_UPDATED);
      if (lastModified > newestPlanDate) newestPlanDate = lastModified;
      return {
        // Must match the canonical in preview/[id]/layout.tsx exactly (no query string)
        url: `${SITE_URL}/preview/${plan.id}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error(
      'Sitemap: failed to fetch public lesson plans, returning static routes only.',
      error
    );
  }

  // "/" permanently redirects to "/home", so only the destination is listed
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/home`,
      lastModified: STATIC_CONTENT_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/discover`,
      lastModified: newestPlanDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: STATIC_CONTENT_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_CONTENT_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: STATIC_CONTENT_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-and-conditions`,
      lastModified: STATIC_CONTENT_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...planRoutes];
}
