'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMarkdown } from './content.compiler';

const BASE_CONTENT_DIR = path.join(process.cwd(), 'src/lib/contents');

export async function getMarkdownContent(relativePath) {
  try {
    const fullPath = path.resolve(BASE_CONTENT_DIR, `${relativePath}.md`);
    
    if (!fullPath.startsWith(BASE_CONTENT_DIR)) {
      console.error(`Security Error: Path traversal attempt: ${relativePath}`);
      return null;
    }

    if (!fs.existsSync(fullPath)) {
      console.warn(`Markdown file not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const pageStrings = content.split(/\n---\n/);
    
    const pageBlocks = await Promise.all(
      pageStrings.map(async (p) => await compileMarkdown(p))
    );
    
    return { 
      metadata: data, 
      content: pageBlocks[0], 
      pageBlocks: pageBlocks 
    };
  } catch (error) {
    console.error(`Error loading Markdown content: ${relativePath}`, error);
    return null;
  }
}

export async function getJSONContent(relativePath) {
  try {
    if (relativePath.includes('..') || relativePath.startsWith('/')) {
      return null;
    }
    const content = await import(`./contents/${relativePath}.json`);
    return content.default;
  } catch (error) {
    console.error(`Error loading JSON content: ${relativePath}`, error);
    return null;
  }
}

export async function fetchProgramContent(href) {
  return await getMarkdownContent(`programs/${href}`);
}
