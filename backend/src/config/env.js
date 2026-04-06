import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mcp_trading",
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  defaultSymbol: (process.env.DEFAULT_SYMBOL || "BTCUSDT").toUpperCase(),
  binanceRestBaseUrl: process.env.BINANCE_REST_BASE_URL || "https://api.binance.com",
  binanceWsBaseUrl: process.env.BINANCE_WS_BASE_URL || "wss://stream.binance.com:9443/ws",
  initialCashBalance: Number(process.env.INITIAL_CASH_BALANCE || 10000)
};
