import { priceEmitter } from "../events/priceEmitter.js";
import { logTransaction } from "../utils/logger.js";
import { generateInvoicePDF } from "../utils/pdfGenerator.js";
import { sendConfirmationEmail } from "../utils/mailer.js";
import crypto from "crypto";

export function invest(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    let amount;

    try {
      ({ amount } = JSON.parse(body || "{}"));
    } catch {
      return res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ error: "Invalid JSON" }));
    }

    if (!amount || amount <= 0) {
      return res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ error: "Invalid amount" }));
    }

    const pricePerOz = priceEmitter.getPrice();
    const goldSold = Number((amount / pricePerOz).toFixed(4));
    const transactionId = crypto.randomUUID();

    // 1. Log transaksi ke file teks
    logTransaction({ amount, pricePerOz, goldSold });

    try {
      // 2. Generate PDF invoice
      const { fileName } = await generateInvoicePDF({
        amount,
        pricePerOz,
        goldSold,
        transactionId,
      });

      // 3. Kirim mock email konfirmasi
      await sendConfirmationEmail({
        to: "customer@example.com", // bisa diambil dari request body jika ada field email
        amount,
        pricePerOz,
        goldSold,
        transactionId,
        pdfFileName: fileName,
      });

      res.writeHead(200, { "Content-Type": "application/json" }).end(
        JSON.stringify({
          amountPaid: amount,
          pricePerOz,
          goldSold,
          transactionId,
          invoiceUrl: `/invoices/${fileName}`,
        }),
      );
    } catch (err) {
      console.error("Failed to generate PDF or send email:", err);
      res
        .writeHead(500, { "Content-Type": "application/json" })
        .end(JSON.stringify({ error: "Failed to process invoice/email" }));
    }
  });
}
