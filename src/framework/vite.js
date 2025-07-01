import fs from 'fs';
import path from 'path';
import { logInfo, logSuccess } from '../utils/logger.js';

export function patchViteConfig(projectDir = process.cwd()) {
  const viteFileTs = path.join(projectDir, 'vite.config.ts');
  const viteFileJs = path.join(projectDir, 'vite.config.js');

  const filePath = fs.existsSync(viteFileTs)
    ? viteFileTs
    : fs.existsSync(viteFileJs)
    ? viteFileJs
    : null;

  if (!filePath) {
    logInfo('Vite config not found. Skipping patch.');
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('server')) {
    content += `\nexport default {\n  server: { allowedHosts: 'all' }\n};\n`;
  } else if (!content.includes('allowedHosts')) {
    content = content.replace(
      /server\s*:\s*{([^}]*)}/,
      `server: { allowedHosts: 'all', $1 }`
    );
  }

  fs.writeFileSync(filePath, content);
  logSuccess('✔️ Patched Vite config to allow external hosts.');
}