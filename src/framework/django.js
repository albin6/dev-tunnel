import fs from 'fs';
import path from 'path';
import { logInfo, logSuccess } from '../utils/logger.js';

export async function patchDjangoSettings(projectDir = process.cwd(), host) {
  const settingsPath = findSettingsPy(projectDir);
  if (!settingsPath) {
    logInfo('settings.py not found. Skipping Django patch.');
    return;
  }

  let content = fs.readFileSync(settingsPath, 'utf-8');

  if (content.includes(host)) {
    logInfo('Django already configured with this host.');
    return;
  }

  const allowedPattern = /ALLOWED_HOSTS\s*=\s*\[([^\]]*)\]/;
  if (allowedPattern.test(content)) {
    content = content.replace(allowedPattern, (match, group) => {
      return `ALLOWED_HOSTS = [${group}, '${host}']`;
    });
  } else {
    content += `\nALLOWED_HOSTS = ['${host}']\n`;
  }

  fs.writeFileSync(settingsPath, content);
  logSuccess(`✔️ Patched Django ALLOWED_HOSTS with: '${host}'`);
}

function findSettingsPy(projectDir) {
  let result;
  function search(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        search(full);
      } else if (file === 'settings.py') {
        result = full;
        break;
      }
    }
  }
  search(projectDir);
  return result;
}
