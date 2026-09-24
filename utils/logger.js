import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sanitizeHtml from "sanitize-html";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, "..", "transactions.log");

export function logTransaction({ amount, pricePerOz, goldSold }) {
  const safeAmount = sanitizeHtml(String(amount));
  const line = `${new Date().toISOString()}, amount paid: Rp${safeAmount}, price per Oz: Rp${pricePerOz.toFixed(2)}, gold sold: ${goldSold} Oz\n`;

  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error("Failed to write log:", err);
  });
}
