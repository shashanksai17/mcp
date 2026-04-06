import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true
    },
    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.00000001
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    notional: {
      type: Number,
      required: true,
      min: 0
    },
    mode: {
      type: String,
      enum: ["PAPER"],
      default: "PAPER"
    },
    status: {
      type: String,
      enum: ["FILLED", "REJECTED"],
      default: "FILLED"
    }
  },
  { timestamps: true }
);

export const Trade = mongoose.model("Trade", tradeSchema);
