/**
 * Every successful response shares one envelope so the client never has to
 * guess at the shape: { success, data, meta? }.
 */
export const sendSuccess = (res, data, { status = 200, meta } = {}) =>
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });

export const sendCreated = (res, data, meta) => sendSuccess(res, data, { status: 201, meta });

export const sendNoContent = (res) => res.status(204).end();

export default sendSuccess;
