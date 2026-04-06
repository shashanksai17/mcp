# MCP Layer

This project implements a practical MCP-style architecture:

Frontend -> MCP Client -> MCP Server -> Tools

- MCP Client: frontend/src/services/mcpClient.js
- MCP Server: backend/src/app.js with /mcp/* routes
- Tools:
  - Binance REST + WS services
  - AI signal engine
  - MongoDB persistence

## MCP Tool Endpoints
- GET /mcp/price
- GET /mcp/orderbook
- GET /mcp/candles
- POST /mcp/trade
- GET /mcp/signal
