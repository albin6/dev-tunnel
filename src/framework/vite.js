import fs from 'fs';
import path from 'path';
import { logInfo, logSuccess } from '../utils/logger.js';

export function patchViteConfig(projectDir = process.cwd(), newHost) {
  if (!newHost) {
    logInfo('No Ngrok host provided. Skipping patch.');
    return;
  }

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

  const allowedHostsLine = `allowedHosts: ["${newHost}"],`;

  if (content.includes('allowedHosts')) {
    // Replace existing allowedHosts value
    content = content.replace(
      /allowedHosts\s*:\s*\[[^\]]*\]/,
      `allowedHosts: ["${newHost}"]`
    );
    logInfo('Replaced existing allowedHosts URL.');
  } else if (/server\s*:\s*{[^}]*}/s.test(content)) {
    // Insert allowedHosts inside existing server block
    content = content.replace(/server\s*:\s*{([^}]*)}/s, (match, inner) => {
      return `server: {\n    ${allowedHostsLine}\n    ${inner.trim()}\n  }`;
    });
    logInfo('Inserted allowedHosts into existing server config.');
  } else {
    // No server block — add full export (not common but fallback)
    content += `\nexport default {\n  server: {\n    ${allowedHostsLine}\n  }\n};\n`;
    logInfo('Added new server config with allowedHosts.');
  }

  fs.writeFileSync(filePath, content);
  logSuccess(`✔️ Patched Vite config with allowedHost: ${newHost}`);
}
