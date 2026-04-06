export function PnLCard({ portfolio }) {
  return (
    <div className="card pnl-card">
      <h3>Portfolio & PnL</h3>
      <div className="pnl-grid">
        <div>
          <span>Cash</span>
          <strong>${Number(portfolio?.cashBalance || 0).toFixed(2)}</strong>
        </div>
        <div>
          <span>Position Value</span>
          <strong>${Number(portfolio?.positionMarketValue || 0).toFixed(2)}</strong>
        </div>
        <div>
          <span>Total Equity</span>
          <strong>${Number(portfolio?.totalEquity || 0).toFixed(2)}</strong>
        </div>
        <div>
          <span>PnL</span>
          <strong className={Number(portfolio?.pnl || 0) >= 0 ? "pos" : "neg"}>
            ${Number(portfolio?.pnl || 0).toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}
