import { program } from 'commander';
import inquirer from 'inquirer';
import { ensureAuthtoken } from './config/authtoken.js';
import { createTunnel } from './tunnel/ngrok.js';
import { detectFramework } from './framework/detect.js';
import { patchFrameworkConfig } from './framework/patch.js';

const FRAMEWORKS_REQUIRE_PORT_PROMPT = [
  'express',
  'express-ejs',
  'spring',
  'django',
  'go-gin',
  'dotnet',
];

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

  // Determine the port (from flag, prompt, or default)
  let port = options.port;

  if (!port) {
    if (FRAMEWORKS_REQUIRE_PORT_PROMPT.includes(detected)) {
      const response = await inquirer.prompt([
        {
          type: 'input',
          name: 'port',
          message: `Enter the port your ${detected} server is running on:`,
          validate: (input) =>
            /^\d+$/.test(input) ? true : 'Please enter a valid numeric port',
        },
      ]);
      port = response.port;
    } else {
      port = '5173'; // default for Vite and similar tools
    }
  }

  console.log(`ℹ️  Starting tunnel for http://localhost:${port} ...`);

  const url = await createTunnel({
    port,
    openBrowser: options.open,
  });

  const ngrokHost = url.split('//')[1];
  await patchFrameworkConfig(detected, ngrokHost);
}
