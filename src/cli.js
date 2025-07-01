import { ensureAuthtoken } from './config/authtoken.js';
import { createTunnel } from './tunnel/ngrok.js';
import { patchViteConfig } from './framework/vite.js';
import { detectFramework } from './framework/detect.js';

export async function runCli() {
  await ensureAuthtoken();

  const detected = detectFramework();
  console.log(`🔍 Detected framework: ${detected}`);

  if (detected === 'vite') await patchViteConfig();

  await createTunnel();
}
