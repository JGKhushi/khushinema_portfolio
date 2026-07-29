import nodemailer from 'nodemailer';
import env from '../config/env.js';
import logger from './logger.js';

/**
 * Email notifications for contact-form submissions.
 *
 * Deliberately optional: if SMTP is not configured the module logs once and
 * no-ops. Sending is always best-effort — a mail failure must never lose a
 * message or fail the request, because the submission is already saved.
 */

let transporter = null;
let warned = false;

export function isMailConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function getTransporter() {
  if (transporter) return transporter;
  if (!isMailConfigured()) return null;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

  return transporter;
}

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function buildHtml(message) {
  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:6px 14px 6px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
           <td style="padding:6px 0;color:#0f172a;font-size:14px">${escapeHtml(value)}</td>
         </tr>`
      : '';

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f8fafc;padding:28px">
    <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(120deg,#4f46e5,#06b6d4);padding:18px 24px">
        <div style="color:#fff;font-size:17px;font-weight:700">New message from your portfolio</div>
        <div style="color:#e0e7ff;font-size:12px;margin-top:2px">khushinema.dev · contact form</div>
      </div>
      <div style="padding:22px 24px">
        <table style="border-collapse:collapse;width:100%">
          ${row('From', message.name)}
          ${row('Email', message.email)}
          ${row('Company', message.company)}
          ${row('Subject', message.subject)}
        </table>
        <div style="margin-top:18px;padding-top:16px;border-top:1px solid #e2e8f0">
          <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px">Message</div>
          <div style="color:#0f172a;font-size:15px;line-height:1.65;white-space:pre-wrap">${escapeHtml(message.message)}</div>
        </div>
        <a href="mailto:${escapeHtml(message.email)}?subject=Re: ${encodeURIComponent(message.subject || 'Your message')}"
           style="display:inline-block;margin-top:22px;background:#4f46e5;color:#fff;text-decoration:none;padding:11px 20px;border-radius:9px;font-size:14px;font-weight:600">
          Reply to ${escapeHtml(message.name)}
        </a>
      </div>
    </div>
  </div>`;
}

/**
 * Notify the site owner about a new submission.
 * Never throws — resolves `false` when the mail could not be sent.
 *
 * @param {{name:string,email:string,company?:string,subject?:string,message:string}} message
 * @returns {Promise<boolean>}
 */
export async function sendContactNotification(message) {
  const mailer = getTransporter();

  if (!mailer) {
    if (!warned) {
      warned = true;
      logger.warn(
        'SMTP is not configured — contact messages are saved to the database but not emailed. ' +
          'Set SMTP_HOST / SMTP_USER / SMTP_PASS in .env to enable notifications.',
      );
    }
    return false;
  }

  try {
    await mailer.sendMail({
      // Most providers require `from` to match the authenticated account, so the
      // sender's address goes in replyTo — hitting Reply answers them directly.
      from: `"Portfolio contact" <${env.SMTP_USER}>`,
      to: env.MAIL_TO || env.ADMIN_EMAIL,
      replyTo: `"${message.name}" <${message.email}>`,
      subject: `Portfolio: ${message.subject?.trim() || `New message from ${message.name}`}`,
      text:
        `New message from your portfolio\n\n` +
        `From:    ${message.name} <${message.email}>\n` +
        (message.company ? `Company: ${message.company}\n` : '') +
        (message.subject ? `Subject: ${message.subject}\n` : '') +
        `\n${message.message}\n`,
      html: buildHtml(message),
    });

    logger.info(`Contact notification emailed to ${env.MAIL_TO || env.ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    // Swallow: the message is already persisted, so this is not fatal.
    logger.error('Failed to send contact notification email', error?.message ?? error);
    return false;
  }
}

/**
 * Checks the SMTP credentials once at boot and reports the result clearly.
 * Without this an invalid password fails silently on every submission — the
 * message still saves, but nothing arrives and nobody knows why.
 * Never throws; the API runs fine regardless.
 */
export async function verifyMailer() {
  if (!isMailConfigured()) {
    logger.warn('Email notifications disabled (SMTP not configured) — messages save to the DB only');
    return false;
  }

  // Catch the most common mistake: pasting the docs placeholder verbatim.
  if (/^(REPLACE_WITH|your-|abcdefghijklmnop)/i.test(env.SMTP_PASS ?? '')) {
    logger.error(
      'SMTP_PASS is still the placeholder from .env.example. Generate a real Gmail ' +
        'App Password at https://myaccount.google.com/apppasswords and put it in backend/.env',
    );
    return false;
  }

  try {
    await getTransporter().verify();
    logger.success(`Email notifications ready → ${env.MAIL_TO || env.ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    const reason = String(error?.message ?? error).split('\n')[0];
    logger.error(`Email notifications NOT working — ${reason}`);
    if (/invalid login|535/i.test(reason)) {
      logger.warn(
        'Gmail rejected the credentials. Use a 16-character App Password (not your ' +
          'Gmail password): https://myaccount.google.com/apppasswords',
      );
    }
    return false;
  }
}

export default sendContactNotification;
