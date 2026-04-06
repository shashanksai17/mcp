import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export function CandleChart({ symbol }) {
  return (
    <div className="card chart-card">
      <h3>Candlestick Chart</h3>
      <AdvancedRealTimeChart
        symbol={`BINANCE:${symbol}`}
        theme="light"
        autosize
        interval="1"
        timezone="Etc/UTC"
        hide_top_toolbar={false}
      />
    </div>
  );
}
