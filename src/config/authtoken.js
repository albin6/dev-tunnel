import inquirer from 'inquirer';
import { getRcConfig, saveRcConfig } from './rcfile.js';
import { logSuccess } from '../utils/logger.js';
import { config } from 'process';

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

  // Store the authtoken in the config file to be used later
  saveRcConfig({ ...config, authtoken });
  logSuccess('Authtoken saved and configured successfully.');
}
