import { patchViteConfig } from './vite.js';
import { patchExpressEJS } from './express-ejs.js';
import { patchDjangoSettings } from './django.js';
import { logInfo } from '../utils/logger.js';

export async function patchFrameworkConfig(framework, host) {
  switch (framework) {
    case 'vite':
      await patchViteConfig(process.cwd(), host);
      break;
    case 'express-ejs':
      await patchExpressEJS(process.cwd(), host);
      break;
    case 'django':
      await patchDjangoSettings(process.cwd(), host);
      break;
    case 'next':
      logInfo(`Manual patch needed. Please add devServer: { host: '0.0.0.0' } to next.config.js`);
      break;
    default:
      logInfo(`No patching logic defined for: ${framework}`);
  }
}
