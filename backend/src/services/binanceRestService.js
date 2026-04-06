import axios from "axios";
import { env } from "../config/env.js";

const client = axios.create({
  baseURL: env.binanceRestBaseUrl,
  timeout: 10000
});

export async function getPrice(symbol) {
  const { data } = await client.get("/api/v3/ticker/price", {
    params: { symbol: symbol.toUpperCase() }
  });

  return {
    symbol: data.symbol,
    price: Number(data.price)
  };
}

export async function getOrderBook(symbol, limit = 20) {
  const { data } = await client.get("/api/v3/depth", {
    params: { symbol: symbol.toUpperCase(), limit }
  });

  return {
    lastUpdateId: data.lastUpdateId,
    bids: data.bids.map(([price, quantity]) => ({ price: Number(price), quantity: Number(quantity) })),
    asks: data.asks.map(([price, quantity]) => ({ price: Number(price), quantity: Number(quantity) }))
  };
}

export async function getCandles(symbol, interval = "1m", limit = 100) {
  const { data } = await client.get("/api/v3/klines", {
    params: { symbol: symbol.toUpperCase(), interval, limit }
  });

  return data.map((candle) => ({
    openTime: candle[0],
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
    volume: Number(candle[5]),
    closeTime: candle[6]
  }));
}
