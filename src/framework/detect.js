import fs from 'fs';
import path from 'path';

export function detectFramework(projectDir = process.cwd()) {
  const files = fs.readdirSync(projectDir);

  if (files.includes('vite.config.ts') || files.includes('vite.config.js')) {
    return 'vite';
  }
  if (
    files.includes('next.config.js') ||
    fs.existsSync(path.join(projectDir, 'pages'))
  ) {
    return 'next';
  }
  if (
    fs.existsSync(path.join(projectDir, 'public')) &&
    fs.existsSync(path.join(projectDir, 'src'))
  ) {
    return 'react';
  }

  return 'unknown';
}
