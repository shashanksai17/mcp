import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Portfolio } from "../models/Portfolio.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function signToken(userId) {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const err = new Error("name, email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    const err = new Error("User already exists with this email");
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });
  await Portfolio.create({ user: user._id, cashBalance: env.initialCashBalance });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    message: "Signup successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error("email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
});
