import http from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { binanceStreamService } from "./services/binanceStreamService.js";

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

function getTokenFromUrl(url) {
  try {
    const parsed = new URL(url, `http://localhost:${env.port}`);
    return parsed.searchParams.get("token");
  } catch {
    return null;
  }
}

wss.on("connection", (socket, req) => {
  const token = getTokenFromUrl(req.url || "");
  if (!token) {
    socket.close(1008, "Missing token");
    return;
  }

  try {
    jwt.verify(token, env.jwtSecret);
  } catch {
    socket.close(1008, "Invalid token");
    return;
  }

  socket.send(JSON.stringify({ type: "system", message: "Connected to MCP stream" }));

  socket.on("message", (raw) => {
    try {
      const payload = JSON.parse(raw.toString());
      if (payload?.type === "subscribe" && Array.isArray(payload.symbols)) {
        binanceStreamService.setSymbols(payload.symbols);
      }
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "Invalid websocket message" }));
    }
  });
});

async function bootstrap() {
  await connectDB();

  binanceStreamService.setServerWss(wss);
  binanceStreamService.start();

  server.listen(env.port, () => {
    console.log(`[SERVER] Running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("[SERVER] Startup failed:", error.message);
  process.exit(1);
});
