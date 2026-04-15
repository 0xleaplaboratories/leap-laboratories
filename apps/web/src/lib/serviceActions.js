'use server';

import { getMarkdownContent } from '@/lib/content.server';

/**
 * Server Action to fetch markdown content for a service.
 * @param {string} href - The relative path suffix in services.json
 * @returns {Promise<{metadata: object, content: string}|null>}
 */
export async function fetchServiceContent(href) {
  // We prepend 'services/' here because href in JSON is academy/... or labs/...
  // but physical files are in src/lib/contents/services/...
  return await getMarkdownContent(`services/${href}`);
}
