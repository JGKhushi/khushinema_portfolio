

import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export const submitMessage = asyncHandler(async (req, res) => {
  // Honeypot: a real browser leaves this hidden field empty. Bots fill it.
  if (req.body.website) {
    logger.warn('Honeypot triggered on contact form');
    return sendCreated(res, { delivered: true });
  }

  const message = await Message.create({
    name: req.body.name,
    email: req.body.email,
    company: req.body.company,
    subject: req.body.subject,
    message: req.body.message,
    meta: {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      referrer: req.get('referer'),
    },
  });

  logger.info(`New contact message from ${message.email}`);
  return sendCreated(res, { delivered: true, id: message.id });
});

export const listMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, status } = req.query;
  const filter = status ? { status } : {};

  const [items, total, unread] = await Promise.all([
    Message.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Message.countDocuments(filter),
    Message.countDocuments({ status: 'new' }),
  ]);

  sendSuccess(res, items, {
    meta: { total, unread, page, limit, pages: Math.max(1, Math.ceil(total / limit)) },
  });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!message) throw ApiError.notFound('Message not found');
  sendSuccess(res, message);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw ApiError.notFound('Message not found');
  sendNoContent(res);
});
