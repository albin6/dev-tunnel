import fs from 'fs';
import path from 'path';
import { logInfo, logSuccess } from '../utils/logger.js';

export async function patchExpressEJS(projectDir = process.cwd(), host) {
  const candidateFiles = ['app.js', 'server.js', 'index.js'];
  const file = candidateFiles.find(f => fs.existsSync(path.join(projectDir, f)));

  if (!file) {
    logInfo('Express entry file not found. Skipping patch.');
    return;
  }

  const filePath = path.join(projectDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('res.setHeader("Access-Control-Allow-Origin"')) {
    logInfo('Express EJS already patched.');
    return;
  }

  const patchCode = `
        app.use((req, res, next) => {
          res.setHeader("Access-Control-Allow-Origin", "https://${host}");
          next();
        });
    `;

  // Naive inject after app setup
  const match = content.match(/app\s*=\s*express\(\);?/);
  if (match) {
    content = content.replace(match[0], `${match[0]}\n${patchCode}`);
    fs.writeFileSync(filePath, content);
    logSuccess(`✔️ Patched Express EJS to allow origin: https://${host}`);
  } else {
    logInfo('Could not auto-patch Express. Please add allow-origin header manually.');
  }
}
