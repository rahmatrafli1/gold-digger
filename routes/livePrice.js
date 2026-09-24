import { priceEmitter } from "../events/priceEmitter.js";

export function streamPrice(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (price) => res.write(`data: ${JSON.stringify({ price })}\n\n`);
  send(priceEmitter.getPrice());

  priceEmitter.on("price", send);
  req.on("close", () => priceEmitter.off("price", send));
}
