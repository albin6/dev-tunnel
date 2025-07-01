#!/usr/bin/env node

import { runTunnel } from "../lib/tunnel.js";
import { ensureAuthtoken } from "../lib/config.js";

(async () => {
  await ensureAuthtoken();
  await runTunnel();
})();
