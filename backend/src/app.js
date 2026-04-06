import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import mcpRoutes from "./routes/mcpRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: true, service: "mcp-crypto-trading-backend", status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/mcp", mcpRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/users", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
