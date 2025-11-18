import ngrok from 'ngrok';
import clipboard from 'clipboardy';
import open from 'open';
import { logInfo, logSuccess, logError } from '../utils/logger.js';
import { getRcConfig } from '../config/rcfile.js';

export async function createTunnel({ port, openBrowser }) {
  logInfo(`Starting tunnel for http://localhost:${port} ...`);

  try {
    // Get the authtoken from config and set it as environment variable
    const config = getRcConfig();
    if (config.authtoken) {
      process.env.NGROK_AUTHTOKEN = config.authtoken;
    }

    // Attempt to kill existing ngrok processes to ensure a clean state
    try {
      await ngrok.kill();
      // Wait for agent to fully terminate
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      // Ignore if there's no agent to kill
    }

    // Connect to ngrok
    const url = await ngrok.connect({
      addr: parseInt(port, 10),
      proto: 'http'
    });

    logSuccess(`🌐 Public URL: ${url}`);

    await clipboard.write(url);
    logInfo('🔗 URL copied to clipboard.');

    if (openBrowser) {
      await open(url);
      logInfo('🌍 URL opened in browser.');
    }

    return url;
  } catch (error) {
    // Check if this is the known ngrok v5 beta issue
    if (error.message && error.message.includes('already exists')) {
      logError('Failed to create tunnel: This appears to be a known issue with ngrok v5 beta where tunnel names conflict.');
      logError('As a workaround, try restarting your system or killing any background ngrok processes manually.');
      logError('Alternatively, consider using ngrok v4 stable version if this issue persists.');
    } else {
      logError(`Failed to create tunnel: ${error.message}`);
    }
    throw error;
  }
}
