// Sends enquiry notifications. No-op (logged) when SMTP_HOST is not set, so dev works without a mail server.
const nodemailer = require('nodemailer');

let transport = null;
if (process.env.SMTP_HOST) {
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

async function notify(to, subject, text) {
  if (!transport) return console.log(`[mail disabled] to=${to} subject=${subject}`);
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM || to, to, subject, text });
  } catch (e) {
    console.error('mail failed:', e.message); // enquiry is already stored; don't fail the request
  }
}

module.exports = { notify };
