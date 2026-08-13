import type { MetadataRoute } from 'next';
import openAIService from '@/lib/services/openai.service';
import { connectionReady } from '@/lib/db';

export const revalidate = 3600;

const SITE_URL = process.env.PUBLIC_APP_URL || 'https://lessora.ajgenabio.me';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let planRoutes: MetadataRoute.Sitemap = [];
  try {
    await Promise.race([
      connectionReady,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB connection timed out')), 15_000)
      ),
    ]);
    const plans = await openAIService.listPublicLessonPlans();
    planRoutes = plans.map((plan) => ({
      url: `${SITE_URL}/preview/${plan.id}?public=true`,
      lastModified: plan.updatedAt || plan.createdAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error(
      'Sitemap: failed to fetch public lesson plans, returning static routes only.',
      error
    );
  }

  return [...staticRoutes, ...planRoutes];
}
