import { Portfolio } from "../models/Portfolio.js";
import { Trade } from "../models/Trade.js";
import { env } from "../config/env.js";

async function getOrCreatePortfolio(userId) {
  let portfolio = await Portfolio.findOne({ user: userId });

  if (!portfolio) {
    portfolio = await Portfolio.create({
      user: userId,
      cashBalance: env.initialCashBalance,
      positions: []
    });
  }

  return portfolio;
}

export async function executePaperTrade({ userId, symbol, side, quantity, marketPrice }) {
  const normalizedSymbol = symbol.toUpperCase();
  const normalizedSide = side.toUpperCase();
  const qty = Number(quantity);
  const price = Number(marketPrice);
  const notional = Number((qty * price).toFixed(8));

  if (!["BUY", "SELL"].includes(normalizedSide)) {
    const err = new Error("side must be BUY or SELL");
    err.statusCode = 400;
    throw err;
  }

  if (!Number.isFinite(qty) || qty <= 0) {
    const err = new Error("quantity must be a positive number");
    err.statusCode = 400;
    throw err;
  }

  const portfolio = await getOrCreatePortfolio(userId);
  let position = portfolio.positions.find((p) => p.symbol === normalizedSymbol);

  if (!position) {
    position = { symbol: normalizedSymbol, quantity: 0, avgPrice: 0, lastPrice: price };
    portfolio.positions.push(position);
  }

  if (normalizedSide === "BUY") {
    if (portfolio.cashBalance < notional) {
      const err = new Error("Insufficient cash balance for BUY order");
      err.statusCode = 400;
      throw err;
    }

    const newQty = position.quantity + qty;
    const newAvgPrice = newQty === 0 ? 0 : (position.quantity * position.avgPrice + qty * price) / newQty;

    position.quantity = Number(newQty.toFixed(8));
    position.avgPrice = Number(newAvgPrice.toFixed(8));
    position.lastPrice = price;
    portfolio.cashBalance = Number((portfolio.cashBalance - notional).toFixed(8));
  }

  if (normalizedSide === "SELL") {
    if (position.quantity < qty) {
      const err = new Error("Insufficient asset quantity for SELL order");
      err.statusCode = 400;
      throw err;
    }

    position.quantity = Number((position.quantity - qty).toFixed(8));
    position.lastPrice = price;
    portfolio.cashBalance = Number((portfolio.cashBalance + notional).toFixed(8));

    if (position.quantity === 0) {
      portfolio.positions = portfolio.positions.filter((p) => p.symbol !== normalizedSymbol);
    }
  }

  await portfolio.save();

  const trade = await Trade.create({
    user: userId,
    symbol: normalizedSymbol,
    side: normalizedSide,
    quantity: qty,
    price,
    notional,
    mode: "PAPER",
    status: "FILLED"
  });

  return { trade, portfolio };
}

export async function getPortfolioSummary(userId) {
  const portfolio = await getOrCreatePortfolio(userId);

  const positionMarketValue = portfolio.positions.reduce(
    (sum, pos) => sum + pos.quantity * (pos.lastPrice || pos.avgPrice),
    0
  );

  const totalEquity = Number((portfolio.cashBalance + positionMarketValue).toFixed(8));
  const pnl = Number((totalEquity - env.initialCashBalance).toFixed(8));

  return {
    cashBalance: portfolio.cashBalance,
    positions: portfolio.positions,
    positionMarketValue: Number(positionMarketValue.toFixed(8)),
    totalEquity,
    pnl
  };
}
