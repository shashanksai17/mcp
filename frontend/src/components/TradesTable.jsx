export function TradesTable({ trades }) {
  return (
    <div className="card trades-card">
      <h3>Trade History</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Notional</th>
            </tr>
          </thead>
          <tbody>
            {trades.slice(0, 20).map((trade) => (
              <tr key={trade._id}>
                <td>{new Date(trade.createdAt).toLocaleTimeString()}</td>
                <td>{trade.symbol}</td>
                <td className={trade.side === "BUY" ? "pos" : "neg"}>{trade.side}</td>
                <td>{trade.quantity}</td>
                <td>{trade.price.toFixed(2)}</td>
                <td>{trade.notional.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
