import type { MetadataRoute } from 'next';
import { CALCULATORS } from '@/lib/catalog';

const BASE = 'https://fincalc.betterapp.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  return [
    { url: `${BASE}/`, lastModified: today, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/all/`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    ...CALCULATORS.map((c) => ({
      url: `${BASE}/calculators/${c.slug}/`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
