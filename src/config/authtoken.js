import inquirer from 'inquirer';
import ngrok from 'ngrok';
import { getRcConfig, saveRcConfig } from './rcfile.js';
import { logSuccess } from '../utils/logger.js';

export async function ensureAuthtoken() {
  const config = getRcConfig();
  if (config.authtoken) return;

  const { authtoken } = await inquirer.prompt([
    {
      type: 'input',
      name: 'authtoken',
      message: 'Enter your Ngrok authtoken:',
    },
  ]);

  await ngrok.authtoken(authtoken);
  saveRcConfig({ ...config, authtoken });
  logSuccess('✅ Authtoken saved and configured successfully.');
}
