import WebSocket from "ws";
import { env } from "../config/env.js";

class BinanceStreamService {
  constructor() {
    this.streamSymbols = new Set([env.defaultSymbol.toLowerCase()]);
    this.streamSocket = null;
    this.serverWss = null;
    this.reconnectDelayMs = 2000;
    this.maxReconnectDelayMs = 30000;
    this.reconnectTimer = null;
    this.isShuttingDown = false;
  }

  setServerWss(wss) {
    this.serverWss = wss;
  }

  setSymbols(symbols = []) {
    this.streamSymbols = new Set(
      symbols.map((s) => s.toLowerCase()).filter(Boolean)
    );

    if (this.streamSymbols.size === 0) {
      this.streamSymbols.add(env.defaultSymbol.toLowerCase());
    }

    this.reconnect();
  }

  start() {
    this.isShuttingDown = false;
    this.connect();
  }

  stop() {
    this.isShuttingDown = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.streamSocket) {
      this.streamSocket.on("error", () => {});
      this.streamSocket.terminate();
      this.streamSocket = null;
    }
  }

  reconnect() {
    if (this.streamSocket) {
      this.streamSocket.on("error", () => {});
      this.streamSocket.terminate();
      this.streamSocket = null;
    }
    this.scheduleReconnect();
  }

  connect() {
    const streams = [];
    this.streamSymbols.forEach((symbol) => {
      streams.push(`${symbol}@trade`);
      streams.push(`${symbol}@depth20@100ms`);
      streams.push(`${symbol}@kline_1m`);
    });

    const url = `${env.binanceWsBaseUrl}/${streams.join("/")}`;
    this.streamSocket = new WebSocket(url);

    this.streamSocket.on("open", () => {
      console.log("[Binance WS] Connected");
      this.reconnectDelayMs = 2000;
    });

    this.streamSocket.on("message", (raw) => {
      try {
        const payload = JSON.parse(raw.toString());
        this.broadcast(payload);
      } catch (error) {
        console.error("[Binance WS] Parse error:", error.message);
      }
    });

    this.streamSocket.on("error", (error) => {
      console.error("[Binance WS] Error:", error.message);
    });

    this.streamSocket.on("close", () => {
      console.warn("[Binance WS] Disconnected");
      if (!this.isShuttingDown) this.scheduleReconnect();
    });
  }

  scheduleReconnect() {
    if (this.isShuttingDown) return;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
      this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, this.maxReconnectDelayMs);
    }, this.reconnectDelayMs);
  }

  broadcast(payload) {
    if (!this.serverWss) return;

    const message = JSON.stringify({
      type: "stream",
      data: payload,
      ts: Date.now()
    });

    this.serverWss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export const binanceStreamService = new BinanceStreamService();
