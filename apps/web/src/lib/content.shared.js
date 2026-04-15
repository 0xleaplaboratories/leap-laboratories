/**
 * Utility to fetch JSON content from the lib/contents directory.
 * @param {string} relativePath - The path to the JSON file relative to lib/contents (without .json extension).
 * @returns {object} The parsed JSON content.
 */
export async function getJSONContent(relativePath) {
  try {
    // Security check: Prevent path traversal in dynamic import
    if (relativePath.includes('..') || relativePath.startsWith('/')) {
      console.error(`Security Error: Invalid path structure detected for relativePath: ${relativePath}`);
      return null;
    }

    // Note: dynamic import() remains relative to this file for bundler compatibility.
    // This is safe for both Client and Server components in Next.js.
    const content = await import(`./contents/${relativePath}.json`);
    return content.default;
  } catch (error) {
    console.error(`Error loading JSON content from path: ${relativePath}`, error);
    return null;
  }
}
