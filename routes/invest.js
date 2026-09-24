import { priceEmitter } from "../events/priceEmitter.js";
import { logTransaction } from "../utils/logger.js";

export function invest(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
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

    logTransaction({ amount, pricePerOz, goldSold });

    res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify({ amountPaid: amount, pricePerOz, goldSold }));
  });
}
