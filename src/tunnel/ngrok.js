import ngrok from 'ngrok';
import clipboard from 'clipboardy';
import open from 'open';
import { logInfo, logSuccess, logError } from '../utils/logger.js';
import { getRcConfig } from '../config/rcfile.js';

export async function createTunnel({ port, openBrowser }) {
  logInfo(`Starting tunnel for http://localhost:${port} ...`);

  // Get the authtoken from config
  const config = getRcConfig();

  // Set the authtoken explicitly if available
  if (config.authtoken) {
    await ngrok.authtoken(config.authtoken);
  }

  // Thorough cleanup for ngrok v5 - kill existing tunnels
  try {
    await ngrok.kill();
    // Wait for agent to fully terminate
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (e) {
    // Ignore if there's no agent to kill
  }

  try {
    // Connect to ngrok with a guaranteed unique name
    const url = await ngrok.connect({
      addr: parseInt(port, 10),
      proto: 'http',
      name: `tunnel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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
      logError('As a workaround, make sure no other ngrok processes are running (try restarting your system or manually killing ngrok processes).');
      logError('For a permanent solution, consider using ngrok v4 stable version by downgrading the ngrok package.');
      console.log('\nTo fix this issue, you can:');
      console.log('1. Kill any background ngrok processes manually using task manager or `taskkill /f /im ngrok.exe` (Windows)');
      console.log('2. Restart your computer to clear any ngrok state');
      console.log('3. Consider downgrading to ngrok v4: npm install ngrok@^4.3.3');
    } else if (error.body && error.body.details && error.body.details.err && error.body.details.err.includes('remote gone away')) {
      logError(`Failed to create tunnel: No server is running on http://localhost:${port}`);
      logError('Please make sure your local server is running before creating the tunnel.');
    } else {
      logError(`Failed to create tunnel: ${error.message}`);
    }
    throw error;
  }
}
