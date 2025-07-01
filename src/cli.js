import { ensureAuthtoken } from './config/authtoken.js';
import { createTunnel } from './tunnel/ngrok.js';
import { patchViteConfig } from './framework/vite.js';

export async function runCli() {
  await ensureAuthtoken();
  await patchViteConfig();
  await createTunnel();
}