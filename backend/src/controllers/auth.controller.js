import User from '../models/User.js';
import env from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { signToken } from '../middleware/auth.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: env.isProd ? 'none' : 'lax',
  secure: env.isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  // Same message for "no such user" and "wrong password" — do not leak which.
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user);
  res.cookie('token', token, cookieOptions);
  sendSuccess(res, { token, user });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined });
  sendSuccess(res, { loggedOut: true });
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, req.user);
});
