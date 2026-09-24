import { EventEmitter } from "events";

const BASE_PRICE = Number(process.env.BASE_PRICE) || 1500000;
const MIN_PRICE = 500000;
const FLUCTUATION = 5000;
const UPDATE_INTERVAL = 2000;

class PriceEmitter extends EventEmitter {
  constructor() {
    super();
    this.currentPrice = BASE_PRICE;
  }

  start() {
    setInterval(() => {
      this.currentPrice = Math.max(
        MIN_PRICE,
        this.currentPrice + (Math.random() - 0.5) * FLUCTUATION,
      );
      this.emit("price", this.getPrice());
    }, UPDATE_INTERVAL);
  }

  getPrice() {
    return Number(this.currentPrice.toFixed(2));
  }
}

export const priceEmitter = new PriceEmitter();
