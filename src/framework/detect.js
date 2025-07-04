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

  if (
    files.includes('app.js') ||
    files.includes('server.js') ||
    files.includes('index.js')
  ) {
    if (fs.existsSync(path.join(projectDir, 'views'))) {
      return 'express-ejs';
    }
    return 'express';
  }

  if (files.includes('pom.xml') || files.includes('build.gradle')) {
    return 'spring';
  }

  if (files.includes('manage.py')) {
    return 'django';
  }

  if (files.includes('main.go')) {
    return 'go-gin';
  }

  if (files.find((f) => f.endsWith('.csproj'))) {
    return 'dotnet';
  }

  return 'unknown';
}
