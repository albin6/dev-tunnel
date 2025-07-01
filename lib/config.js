import inquirer from "inquirer";
import os from "os";
import fs from "fs";
import path from "path";
import ngrok from "ngrok";
import { logInfo, logSuccess } from "../utils/logger.js";

const CONFIG_PATH = path.join(os.homedir(), ".dev-tunnelrc");

export function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
}

export async function ensureAuthtoken() {
  const config = getConfig();
  if (config.authtoken) return;

  const { authtoken } = await inquirer.prompt([
    {
      type: "input",
      name: "authtoken",
      message: "Enter your Ngrok authtoken:",
    },
  ]);

  await ngrok.authtoken(authtoken);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({ authtoken }, null, 2));
  logSuccess("Authtoken saved and configured successfully.");
}
