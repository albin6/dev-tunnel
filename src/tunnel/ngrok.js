import inquirer from 'inquirer';
import ngrok from 'ngrok';
import clipboard from 'clipboardy';
import open from 'open';
import { logInfo, logSuccess } from '../utils/logger.js';

export async function createTunnel() {
  const { port } = await inquirer.prompt([
    {
      type: 'input',
      name: 'port',
      message: 'Which port do you want to forward?',
      default: 5173,
      validate: (val) => !isNaN(Number(val)) || 'Port must be a number',
    },
  ]);

  logInfo(`Starting tunnel for http://localhost:${port} ...`);
  const url = await ngrok.connect({ addr: port });
  logSuccess(`🌐 Public URL: ${url}`);

  await clipboard.write(url);
  logInfo('🔗 URL copied to clipboard.');

  await open(url);
  logInfo('🌍 URL opened in browser.');
}