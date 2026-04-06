import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import { getCandles, getOrderBook, getPrice } from "../services/binanceRestService.js";
import { executePaperTrade } from "../services/paperTradeService.js";
import { generateSignal, getAiEngineInfo } from "../services/aiSignalService.js";

export const getLivePrice = asyncHandler(async (req, res) => {
  const symbol = (req.query.symbol || env.defaultSymbol).toUpperCase();
  const data = await getPrice(symbol);

  res.json({ success: true, tool: "price", data });
});

export const getDepth = asyncHandler(async (req, res) => {
  const symbol = (req.query.symbol || env.defaultSymbol).toUpperCase();
  const limit = Number(req.query.limit || 20);
  const data = await getOrderBook(symbol, limit);

  res.json({ success: true, tool: "orderbook", data });
});

export const getOHLC = asyncHandler(async (req, res) => {
  const symbol = (req.query.symbol || env.defaultSymbol).toUpperCase();
  const interval = (req.query.interval || "1m").toLowerCase();
  const limit = Number(req.query.limit || 200);

  const data = await getCandles(symbol, interval, limit);
  res.json({ success: true, tool: "candles", data });
});

export const trade = asyncHandler(async (req, res) => {
  const symbol = (req.body.symbol || env.defaultSymbol).toUpperCase();
  const side = (req.body.side || "").toUpperCase();
  const quantity = Number(req.body.quantity || 0);

  const market = await getPrice(symbol);
  const result = await executePaperTrade({
    userId: req.user.id,
    symbol,
    side,
    quantity,
    marketPrice: market.price
  });

  res.status(201).json({
    success: true,
    tool: "trade",
    mode: "PAPER",
    data: {
      trade: result.trade,
      portfolio: result.portfolio
    }
  });
});

export const signal = asyncHandler(async (req, res) => {
  const symbol = (req.query.symbol || env.defaultSymbol).toUpperCase();
  const strategy = req.query.strategy || "RSI";

  const prediction = await generateSignal(symbol, strategy);

  res.json({
    success: true,
    tool: "signal",
    data: prediction,
    engine: getAiEngineInfo()
  });
});
