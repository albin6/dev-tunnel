import { program } from 'commander';
import { ensureAuthtoken } from './config/authtoken.js';
import { createTunnel } from './tunnel/ngrok.js';
import { patchViteConfig } from './framework/vite.js';
import { detectFramework } from './framework/detect.js';

export async function runCli() {
  program
    .name('dev-tunnel')
    .description('Simple CLI to expose local dev servers using ngrok')
    .version('0.2.0')
    .option('-p, --port <port>', 'Port to forward', '5173')
    .option('-f, --framework <framework>', 'Manually specify framework')
    .option('--no-open', 'Do not open browser after generating URL')
    .parse(process.argv);

  const options = program.opts();
  await ensureAuthtoken();

  const detected = options.framework || detectFramework();
  console.log(`🔍 Detected framework: ${detected}`);

  if (detected === 'vite') await patchViteConfig();
  else if (detected === 'express-ejs')
    console.log('Express + EJS project detected. No patching needed.');
  else if (detected === 'express')
    console.log('Express project detected. No patching needed.');
  else if (['spring', 'django', 'go-gin', 'dotnet'].includes(detected)) {
    console.log(
      `${detected.charAt(0).toUpperCase() + detected.slice(1)} project detected. Proceeding with port forwarding.`
    );
  } else console.log('⚠️ Framework unknown. Proceeding without patching.');

  await createTunnel({ port: options.port, openBrowser: options.open });
}
