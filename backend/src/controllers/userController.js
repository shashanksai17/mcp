import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true, runValidators: true });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, data: user });
});

export const deleteMe = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({ success: true, message: "User account deleted" });
});
