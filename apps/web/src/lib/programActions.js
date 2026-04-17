'use server';

import { getMarkdownContent } from '@/lib/content.server';

/**
 * Server Action to fetch markdown content for a program.
 * @param {string} href - The relative path suffix in programs.json
 * @returns {Promise<{metadata: object, content: string}|null>}
 */
export async function fetchProgramContent(href) {
  // We prepend 'programs/' here because href in JSON is academy/... or labs/...
  // but physical files are in src/lib/contents/programs/...
  return await getMarkdownContent(`programs/${href}`);
}
