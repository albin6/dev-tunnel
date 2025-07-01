import os from 'os';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(os.homedir(), '.dev-tunnelrc');

export function getRcConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

export function saveRcConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}