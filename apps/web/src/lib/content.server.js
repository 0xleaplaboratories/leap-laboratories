'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMarkdown } from './content.compiler';

const BASE_CONTENT_DIR = path.join(process.cwd(), 'src/lib/contents');

function resolveSecurePath(relativePath, extension) {
  const fullPath = path.resolve(BASE_CONTENT_DIR, `${relativePath}${extension}`);
  
  if (!fullPath.startsWith(BASE_CONTENT_DIR)) {
    throw new Error(`Security Error: Path traversal attempt: ${relativePath}`);
  }
  
  return fullPath;
}

function fragmentMarkdown(rawContent) {
  if (!rawContent) return [''];
  return rawContent.split(/\n---\n/);
}

async function processPageBlocks(blocks) {
  return await Promise.all(
    blocks.map(async (block) => await compileMarkdown(block))
  );
}

export async function getMarkdownContent(relativePath) {
  try {
    const fullPath = resolveSecurePath(relativePath, '.md');

    if (!fs.existsSync(fullPath)) {
      console.warn(`Markdown file not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content: rawBody } = matter(fileContents);
    
    const segments = fragmentMarkdown(rawBody);
    const pageBlocks = await processPageBlocks(segments);
    
    return { 
      metadata: data, 
      content: pageBlocks[0], 
      pageBlocks: pageBlocks 
    };
  } catch (error) {
    console.error(`Error loading Markdown content: ${relativePath}`, error.message);
    return null;
  }
}

export async function getJSONContent(relativePath) {
  try {
    const fullPath = resolveSecurePath(relativePath, '.json');

    if (!fs.existsSync(fullPath)) {
      console.warn(`JSON file not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading JSON content: ${relativePath}`, error.message);
    return null;
  }
}

export async function fetchProgramContent(href) {
  return await getMarkdownContent(`programs/${href}`);
}
