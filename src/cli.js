import { program } from 'commander';
import inquirer from 'inquirer';
import { ensureAuthtoken } from './config/authtoken.js';
import { createTunnel } from './tunnel/ngrok.js';
import { detectFramework } from './framework/detect.js';
import { patchFrameworkConfig } from './framework/patch.js';

export async function runCli() {
  program
    .name('dev-tunnel')
    .description('Simple CLI to expose local dev servers using ngrok')
    .version('1.0.5')
    .option('-p, --port <port>', 'Port to forward')
    .option('-f, --framework <framework>', 'Manually specify framework')
    .option('--no-open', 'Do not open browser after generating URL')
    .parse(process.argv);

  const options = program.opts();
  await ensureAuthtoken();

  const detected = options.framework || detectFramework();
  console.log(`🔍 Detected framework: ${detected}`);

  // Define which frameworks need patching
  const patchableFrameworks = ['vite', 'express-ejs', 'django'];

  // Prompt for port if not given and framework doesn't need patching
  let port = options.port;
  if (!port && !patchableFrameworks.includes(detected)) {
    const { userPort } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userPort',
        message: 'Enter the port your server is running on:',
        default: '3000',
        validate: (input) =>
          /^\d+$/.test(input) ? true : 'Please enter a valid numeric port.',
      },
    ]);
    port = userPort;
  }

  // Default to 5173 only if not provided and patching is expected
  if (!port) port = '5173';

  console.log(`ℹ️  Starting tunnel for http://localhost:${port} ...`);

  const url = await createTunnel({
    port,
    openBrowser: options.open,
  });

  const host = url.split('//')[1];
  await patchFrameworkConfig(detected, host);
}
