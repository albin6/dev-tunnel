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
  const allowedHostsRegex = /allowedHosts\s*:\s*\[\s*["']([^"']+)["']\s*\]/;

  if (allowedHostsRegex.test(content)) {
    // ✅ Replace just the domain inside the allowedHosts array
    content = content.replace(
      allowedHostsRegex,
      `allowedHosts: ["${newHost}"]`
    );
    logInfo('Replaced existing allowedHosts domain.');
  } else if (/server\s*:\s*{[^}]*}/s.test(content)) {
    // ✅ Insert allowedHosts line if server block exists but no allowedHosts
    content = content.replace(/server\s*:\s*{([^}]*)}/s, (match, inner) => {
      return `server: {\n    allowedHosts: ["${newHost}"],\n    ${inner.trim()}\n  }`;
    });
    logInfo('Inserted allowedHosts into existing server config.');
  } else {
    // ✅ Fallback: No server block found, add whole block
    content += `\nexport default {\n  server: {\n    allowedHosts: ["${newHost}"]\n  }\n};\n`;
    logInfo('Added new server config with allowedHosts.');
  }

  fs.writeFileSync(filePath, content);
  logSuccess(`✔️ Patched Vite config with allowedHost: "${newHost}"`);
}
