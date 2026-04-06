import { getCandles } from "./binanceRestService.js";

function calculateSMA(values, period) {
  if (values.length < period) return null;
  const subset = values.slice(values.length - period);
  return subset.reduce((sum, v) => sum + v, 0) / period;
}

function calculateRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;

  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i += 1) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export async function generateSignal(symbol, strategy = "RSI") {
  const candles = await getCandles(symbol, "1m", 120);
  const closes = candles.map((c) => c.close);

  const normalizedStrategy = strategy.toUpperCase();
  if (normalizedStrategy === "MA") {
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);

    if (sma20 == null || sma50 == null) {
      return { signal: "HOLD", confidence: 50, strategy: "MA", reason: "Insufficient data" };
    }

    if (sma20 > sma50) {
      const delta = ((sma20 - sma50) / sma50) * 100;
      return {
        signal: "BUY",
        confidence: Math.min(95, Math.max(55, Number((50 + delta * 8).toFixed(2)))),
        strategy: "MA"
      };
    }

    if (sma20 < sma50) {
      const delta = ((sma50 - sma20) / sma20) * 100;
      return {
        signal: "SELL",
        confidence: Math.min(95, Math.max(55, Number((50 + delta * 8).toFixed(2)))),
        strategy: "MA"
      };
    }

    return { signal: "HOLD", confidence: 52, strategy: "MA" };
  }

  const rsi = calculateRSI(closes, 14);
  if (rsi == null) {
    return { signal: "HOLD", confidence: 50, strategy: "RSI", reason: "Insufficient data" };
  }

  if (rsi < 30) {
    return {
      signal: "BUY",
      confidence: Number((70 + ((30 - rsi) / 30) * 25).toFixed(2)),
      strategy: "RSI"
    };
  }

  if (rsi > 70) {
    return {
      signal: "SELL",
      confidence: Number((70 + ((rsi - 70) / 30) * 25).toFixed(2)),
      strategy: "RSI"
    };
  }

  return {
    signal: "HOLD",
    confidence: Number((55 - Math.abs(50 - rsi) * 0.2).toFixed(2)),
    strategy: "RSI"
  };
}

export function getAiEngineInfo() {
  return {
    currentEngine: "RuleBasedTechnicalSignals",
    plugAndPlayInterface: "Replace generateSignal() with LSTM/RL model inference",
    modelAdapterContract: {
      input: ["symbol", "candles", "orderBook", "recentTrades"],
      output: ["signal", "confidence", "metadata"]
    }
  };
}
