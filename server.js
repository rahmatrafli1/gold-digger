import "dotenv/config";
import http from "http";
import { priceEmitter } from "./events/priceEmitter.js";
import { serveStatic } from "./routes/static.js";
import { streamPrice } from "./routes/livePrice.js";
import { invest } from "./routes/invest.js";

const PORT = process.env.PORT || 8000;

priceEmitter.start();

http
  .createServer((req, res) => {
    if (req.url === "/live-price") return streamPrice(req, res);
    if (req.url === "/invest" && req.method === "POST") return invest(req, res);
    serveStatic(req, res);
  })
  .listen(PORT, () =>
    console.log(`GoldDigger running at http://localhost:${PORT}`),
  );
