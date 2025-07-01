import chalk from 'chalk';
import ora from 'ora';

export function logInfo(msg) {
  console.log(chalk.blue('ℹ️ '), msg);
}

export function logSuccess(msg) {
  console.log(chalk.green('✔️ '), msg);
}

export function logError(msg) {
  console.log(chalk.red('❌ '), msg);
}

export function spinnerStart(text) {
  return ora(text).start();
}

export function spinnerStop(spinner, success = true) {
  success ? spinner.succeed() : spinner.fail();
}