import { useState } from "react";
import { placeTrade } from "../services/mcpClient";

export function TradePanel({ symbol, onTradeExecuted }) {
  const [quantity, setQuantity] = useState("0.001");
  const [error, setError] = useState("");

  const submit = async (side) => {
    setError("");
    try {
      await placeTrade({ symbol, side, quantity: Number(quantity) });
      onTradeExecuted?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Trade failed");
    }
  };

  return (
    <div className="card trade-card">
      <h3>Paper Trade Panel</h3>
      <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" step="0.0001" min="0" />
      <div className="trade-actions">
        <button className="buy" onClick={() => submit("BUY")}>BUY</button>
        <button className="sell" onClick={() => submit("SELL")}>SELL</button>
      </div>
      {error ? <small className="error">{error}</small> : null}
    </div>
  );
}
