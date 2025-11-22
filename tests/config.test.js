import fs from 'fs';
import os from 'os';
import path from 'path';
import { getRcConfig, saveRcConfig } from '../src/config/rcfile.js';

const CONFIG_PATH = path.join(os.homedir(), '.dev-tunnelrc');

describe('getRcConfig()', () => {
  beforeAll(() => {
    saveRcConfig({ authtoken: 'test-token' });
  });

  afterAll(() => {
    if (fs.existsSync(CONFIG_PATH)) {
      fs.unlinkSync(CONFIG_PATH);
    }
  });

  it('should return the stored authtoken', () => {
    const config = getRcConfig();
    expect(config.authtoken).toBe('test-token');
  });
});
