import { asyncHandler } from "../utils/asyncHandler.js";
import { getPortfolioSummary } from "../services/paperTradeService.js";
import { Trade } from "../models/Trade.js";

export const getPortfolio = asyncHandler(async (req, res) => {
  const summary = await getPortfolioSummary(req.user.id);

  res.json({ success: true, data: summary });
});

export const getTrades = asyncHandler(async (req, res) => {
  const trades = await Trade.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, data: trades });
});

export const updateTradeTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const trade = await Trade.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { status },
    { new: true }
  );

  if (!trade) {
    const err = new Error("Trade not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, data: trade });
});

export const deleteTrade = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trade = await Trade.findOneAndDelete({ _id: id, user: req.user.id });
  if (!trade) {
    const err = new Error("Trade not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, message: "Trade deleted" });
});
