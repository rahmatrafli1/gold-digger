import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INVOICES_DIR = path.join(__dirname, "..", "invoices");

// Pastikan folder invoices ada
if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR);
}

export function generateInvoicePDF({
  amount,
  pricePerOz,
  goldSold,
  transactionId,
}) {
  return new Promise((resolve, reject) => {
    const fileName = `invoice-${transactionId}.pdf`;
    const filePath = path.join(INVOICES_DIR, fileName);
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(24)
      .fillColor("#d4af37")
      .text("GoldDigger", { align: "center" });

    doc.moveDown();
    doc
      .fontSize(16)
      .fillColor("black")
      .text("Transaction Invoice", { align: "center" });

    doc.moveDown(2);

    // Details
    doc.fontSize(12).fillColor("black");
    doc.text(`Transaction ID: ${transactionId}`);
    doc.text(`Date: ${new Date().toLocaleString("id-ID")}`);
    doc.moveDown();

    doc.text(`Amount Paid: Rp${amount.toLocaleString("id-ID")}`);
    doc.text(`Price per Oz: Rp${pricePerOz.toLocaleString("id-ID")}`);
    doc.text(`Gold Purchased: ${goldSold} Oz`);

    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for investing with GoldDigger. This document serves as proof of your transaction.",
        { align: "center" },
      );

    doc.end();

    stream.on("finish", () => resolve({ fileName, filePath }));
    stream.on("error", reject);
  });
}
