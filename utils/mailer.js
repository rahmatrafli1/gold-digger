import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMAIL_LOG_FILE = path.join(__dirname, "..", "emails.log");

/**
 * Mock email sender — tidak benar-benar mengirim email,
 * hanya mensimulasikan proses & mencatat ke file log.
 */
export function sendConfirmationEmail({
  to,
  amount,
  pricePerOz,
  goldSold,
  transactionId,
  pdfFileName,
}) {
  const emailContent = `
========================================
To: ${to}
Subject: GoldDigger - Purchase Confirmation
Date: ${new Date().toISOString()}
----------------------------------------
Dear Customer,

Thank you for your investment with GoldDigger!

Transaction Details:
- Transaction ID: ${transactionId}
- Amount Paid: Rp${amount.toLocaleString("id-ID")}
- Price per Oz: Rp${pricePerOz.toLocaleString("id-ID")}
- Gold Purchased: ${goldSold} Oz

Your invoice is attached: ${pdfFileName}

Best regards,
GoldDigger Team
========================================

`;

  fs.appendFile(EMAIL_LOG_FILE, emailContent, (err) => {
    if (err) console.error("Failed to log mock email:", err);
  });

  console.log(`📧 Mock email sent to ${to} (Transaction: ${transactionId})`);

  return Promise.resolve({ success: true, to, transactionId });
}
