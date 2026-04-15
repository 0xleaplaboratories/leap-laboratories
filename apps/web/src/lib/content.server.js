import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BASE_CONTENT_DIR = path.join(process.cwd(), 'src/lib/contents');

/**
 * Utility to fetch Markdown content from the lib/contents directory.
 * @param {string} relativePath - The path to the MD file relative to lib/contents (without .md extension).
 * @returns {object} { metadata: Object, content: String }
 */
export async function getMarkdownContent(relativePath) {
  try {
    const fullPath = path.resolve(BASE_CONTENT_DIR, `${relativePath}.md`);
    
    // Security check: Prevent path traversal vulnerabilities
    if (!fullPath.startsWith(BASE_CONTENT_DIR)) {
      console.error(`Security Error: Path traversal attempt detected for relativePath: ${relativePath}`);
      return null;
    }

    if (!fs.existsSync(fullPath)) {
      console.warn(`Markdown file not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return { metadata: data, content };
  } catch (error) {
    console.error(`Error loading Markdown content from path: ${relativePath}`, error);
    return null;
  }
}
