export function OrderBook({ orderBook }) {
  const bids = orderBook?.bids?.slice(0, 10) || [];
  const asks = orderBook?.asks?.slice(0, 10) || [];

  return (
    <div className="card orderbook-card">
      <h3>Order Book (Real-time)</h3>
      <div className="orderbook-grid">
        <div>
          <h4>Bids</h4>
          {bids.map((b, idx) => (
            <div key={`bid-${idx}`} className="book-row">
              <span>{b.price.toFixed(2)}</span>
              <span>{b.quantity.toFixed(5)}</span>
            </div>
          ))}
        </div>
        <div>
          <h4>Asks</h4>
          {asks.map((a, idx) => (
            <div key={`ask-${idx}`} className="book-row">
              <span>{a.price.toFixed(2)}</span>
              <span>{a.quantity.toFixed(5)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
