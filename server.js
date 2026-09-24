import "dotenv/config";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EventEmitter } from "events";
import sanitizeHtml from "sanitize-html";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8000;
const LOG_FILE = path.join(__dirname, "transactions.log");
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

// ---------- Live price generator ----------
let currentPrice = Number(process.env.BASE_PRICE) || 1500000; // harga emas per gram/oz dalam Rupiah
const priceEmitter = new EventEmitter();

setInterval(() => {
  currentPrice = Math.max(500000, currentPrice + (Math.random() - 0.5) * 5000);
  priceEmitter.emit("price", Number(currentPrice.toFixed(2)));
}, 2000);

// ---------- Helpers ----------
function serveStatic(req, res) {
  const filePath = path.join(
    PUBLIC_DIR,
    req.url === "/" ? "index.html" : req.url,
  );
  const contentType =
    MIME_TYPES[path.extname(filePath)] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) return res.writeHead(404).end("404 Not Found");
    res.writeHead(200, { "Content-Type": contentType }).end(data);
  });
}

function streamPrice(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (price) => res.write(`data: ${JSON.stringify({ price })}\n\n`);
  send(currentPrice);

  priceEmitter.on("price", send);
  req.on("close", () => priceEmitter.off("price", send));
}

function invest(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const { amount } = JSON.parse(body || "{}");

    if (!amount || amount <= 0) {
      return res
        .writeHead(400, { "Content-Type": "application/json" })
        .end(JSON.stringify({ error: "Invalid amount" }));
    }

    const goldSold = Number((amount / currentPrice).toFixed(4));
    const log = `${new Date().toISOString()}, amount paid: Rp${sanitizeHtml(String(amount))}, price per Oz: Rp${currentPrice.toFixed(2)}, gold sold: ${goldSold} Oz\n`;

    fs.appendFile(LOG_FILE, log, () => {});

    res.writeHead(200, { "Content-Type": "application/json" }).end(
      JSON.stringify({
        amountPaid: amount,
        pricePerOz: currentPrice,
        goldSold,
      }),
    );
  });
}

// ---------- Router ----------
http
  .createServer((req, res) => {
    if (req.url === "/live-price") return streamPrice(req, res);
    if (req.url === "/invest" && req.method === "POST") return invest(req, res);
    serveStatic(req, res);
  })
  .listen(PORT, () =>
    console.log(`GoldDigger running at http://localhost:${PORT}`),
  );
