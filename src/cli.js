import { program } from 'commander';
import { ensureAuthtoken } from './config/authtoken.js';
import { createTunnel } from './tunnel/ngrok.js';
import { detectFramework } from './framework/detect.js';
import { patchFrameworkConfig } from './framework/patch.js';

export async function runCli() {
  program
    .name('dev-tunnel')
    .description('Simple CLI to expose local dev servers using ngrok')
    .version('1.0.5')
    .option('-p, --port <port>', 'Port to forward', '5173')
    .option('-f, --framework <framework>', 'Manually specify framework')
    .option('--no-open', 'Do not open browser after generating URL')
    .parse(process.argv);

  const options = program.opts();
  await ensureAuthtoken();

  const detected = options.framework || detectFramework();
  console.log(`🔍 Detected framework: ${detected}`);

  const url = await createTunnel({
    port: options.port,
    openBrowser: options.open,
  });

  const host = url.split('//')[1];

  await patchFrameworkConfig(detected, host);
}
