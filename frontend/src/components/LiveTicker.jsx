export function LiveTicker({ symbol, price, signal }) {
  return (
    <div className="card ticker-card">
      <h3>Live Ticker</h3>
      <div className="ticker-row">
        <span>{symbol}</span>
        <strong>${Number(price || 0).toLocaleString()}</strong>
      </div>
      <div className="ticker-row">
        <span>AI Signal</span>
        <strong className={`signal ${signal?.signal?.toLowerCase() || "hold"}`}>
          {signal?.signal || "HOLD"} ({signal?.confidence || 50}%)
        </strong>
      </div>
    </div>
  );
}
