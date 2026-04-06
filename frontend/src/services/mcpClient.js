import axios from "axios";

const baseURL = import.meta.env.VITE_MCP_BASE_URL || "http://localhost:5000";

const api = axios.create({ baseURL });

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function getPrice(symbol) {
  const { data } = await api.get("/mcp/price", { params: { symbol } });
  return data;
}

export async function getOrderBook(symbol, limit = 20) {
  const { data } = await api.get("/mcp/orderbook", { params: { symbol, limit } });
  return data;
}

export async function getCandles(symbol, interval = "1m", limit = 200) {
  const { data } = await api.get("/mcp/candles", { params: { symbol, interval, limit } });
  return data;
}

export async function getSignal(symbol, strategy = "RSI") {
  const { data } = await api.get("/mcp/signal", { params: { symbol, strategy } });
  return data;
}

export async function placeTrade(payload) {
  const { data } = await api.post("/mcp/trade", payload);
  return data;
}

export async function getPortfolio() {
  const { data } = await api.get("/portfolio");
  return data;
}

export async function getTrades() {
  const { data } = await api.get("/portfolio/trades");
  return data;
}

export function getWsUrl(token) {
  const wsBase = baseURL.replace("http://", "ws://").replace("https://", "wss://");
  return `${wsBase}/ws?token=${encodeURIComponent(token)}`;
}
