import fs from 'fs';
import os from 'os';
import path from 'path';
import { getConfig } from '../lib/config.js';

const CONFIG_PATH = path.join(os.homedir(), '.dev-tunnelrc');

describe('getConfig()', () => {
  beforeAll(() => {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ authtoken: 'test-token' }));
  });

  afterAll(() => {
    fs.unlinkSync(CONFIG_PATH);
  });

  it('should return the stored authtoken', () => {
    const config = getConfig();
    expect(config.authtoken).toBe('test-token');
  });
});
