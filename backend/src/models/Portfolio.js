import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true },
    quantity: { type: Number, required: true, default: 0 },
    avgPrice: { type: Number, required: true, default: 0 },
    lastPrice: { type: Number, required: true, default: 0 }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    cashBalance: {
      type: Number,
      required: true,
      default: 10000
    },
    positions: {
      type: [positionSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
