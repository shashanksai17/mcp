import { useCallback, useEffect, useState } from "react";
import { getOrderBook, getPortfolio, getPrice, getSignal, getTrades } from "../services/mcpClient";
import { useMcpStream } from "../hooks/useMcpStream";
import { CandleChart } from "./CandleChart";
import { LiveTicker } from "./LiveTicker";
import { OrderBook } from "./OrderBook";
import { PnLCard } from "./PnLCard";
import { TradePanel } from "./TradePanel";
import { TradesTable } from "./TradesTable";

export function TradingDashboard({ token, user, onLogout }) {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [price, setPrice] = useState(0);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [signal, setSignal] = useState({ signal: "HOLD", confidence: 50 });
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState([]);

  const refreshStaticData = useCallback(async () => {
    const [priceRes, bookRes, signalRes, portfolioRes, tradesRes] = await Promise.all([
      getPrice(symbol),
      getOrderBook(symbol, 20),
      getSignal(symbol, "RSI"),
      getPortfolio(),
      getTrades()
    ]);

    setPrice(priceRes.data.price);
    setOrderBook(bookRes.data);
    setSignal(signalRes.data);
    setPortfolio(portfolioRes.data);
    setTrades(tradesRes.data);
  }, [symbol]);

  useEffect(() => {
    refreshStaticData().catch(console.error);
  }, [refreshStaticData]);

  useMcpStream({
    token,
    symbols: [symbol],
    onMessage: (payload) => {
      const streamData = payload?.data?.data;
      if (!streamData || !streamData.e) return;

      if (streamData.e === "trade") {
        setPrice(Number(streamData.p));
      }

      if (streamData.e === "depthUpdate") {
        setOrderBook({
          bids: streamData.b.map(([p, q]) => ({ price: Number(p), quantity: Number(q) })),
          asks: streamData.a.map(([p, q]) => ({ price: Number(p), quantity: Number(q) }))
        });
      }

      if (streamData.e === "kline" && streamData.k?.x) {
        getSignal(symbol, "RSI")
          .then((res) => setSignal(res.data))
          .catch(() => null);
      }
    }
  });

  return (
    <div className="dashboard-wrap">
      <header className="topbar">
        <div>
          <h2>Intelligent MCP Trading Dashboard</h2>
          <p>{user.name} ({user.email})</p>
        </div>
        <div className="topbar-actions">
          <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} />
          <button onClick={() => refreshStaticData()}>Refresh</button>
          <button className="ghost" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="grid">
        <LiveTicker symbol={symbol} price={price} signal={signal} />
        <TradePanel symbol={symbol} onTradeExecuted={refreshStaticData} />
        <PnLCard portfolio={portfolio} />
      </section>

      <section className="main-grid">
        <CandleChart symbol={symbol} />
        <OrderBook orderBook={orderBook} />
      </section>

      <TradesTable trades={trades} />
    </div>
  );
}
