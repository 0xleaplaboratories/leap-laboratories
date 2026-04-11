/**
 * Utility to fetch JSON content from the lib/contents directory.
 * @param {string} path - The path to the JSON file relative to lib/contents (without .json extension).
 * @returns {object} The parsed JSON content.
 */
export async function getJSONContent(path) {
  try {
    // In Next.js, we can use dynamic imports for JSON files.
    // This works both in Server Components and Client Components (though with different bundling implications).
    const content = await import(`./contents/${path}.json`);
    return content.default;
  } catch (error) {
    console.error(`Error loading JSON content from path: ${path}`, error);
    return null;
  }
}
