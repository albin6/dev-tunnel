import ngrok from 'ngrok';
import clipboard from 'clipboardy';
import open from 'open';
import { logInfo, logSuccess } from '../utils/logger.js';

export async function createTunnel({ port, openBrowser }) {
  logInfo(`Starting tunnel for http://localhost:${port} ...`);
  const url = await ngrok.connect({ addr: port });
  logSuccess(`🌐 Public URL: ${url}`);

  await clipboard.write(url);
  logInfo('🔗 URL copied to clipboard.');

  if (openBrowser) {
    await open(url);
    logInfo('🌍 URL opened in browser.');
  }

  return url;
}
