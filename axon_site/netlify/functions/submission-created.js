// netlify/functions/submission-created.js
// Triggered automatically by Netlify when a form submission is created.
// Docs: https://docs.netlify.com/forms/single-page-applications/#trigger-serverless-functions

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    // Netlify posts a JSON body: { payload: { data: {...}, form_name: "...", ... } }
    const { payload } = JSON.parse(event.body || "{}");
    if (!payload || !payload.data) {
      console.error("No payload in event.body");
      return { statusCode: 400, body: "Bad request: missing payload" };
    }

    const formName = payload.form_name || "contact";
    const data = payload.data || {};

    // Honeypot (adjust if your hidden field uses a different name)
    if (data["bot-field"]) {
      console.log("Honeypot filled; skipping email.");
      return { statusCode: 200, body: "ok" };
    }

    // Pull common fields (keep graceful if your field names differ)
    const name = (data.name || data.fullname || data["your-name"] || "").trim();
    const email = (data.email || data["your-email"] || "").trim();
    const message =
      (data.message || data["your-message"] || data["Message"] || "").trim();

    // Build a readable text body from all submitted fields
    const lines = Object.entries(data)
      .filter(([k]) => k !== "bot-field")
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join("\n");

    // Basic validation (relaxed so you still get something even if a field is renamed)
    if (!name && !email && !message) {
      console.warn("Submission has no typical fields; sending anyway.");
    }

    // --- SMTP transport (Microsoft 365 / generic SMTP) ---
    const host = process.env.SMTP_HOST || "smtp.office365.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER; // e.g. info@axonfinancialgroup.com.au
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      console.error("Missing SMTP_USER / SMTP_PASS env vars");
      return { statusCode: 500, body: "Server not configured" };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // false for 587 (STARTTLS), true for 465
      auth: { user, pass },
    });

    const from = process.env.SMTP_FROM || user; // O365: must be the authenticated mailbox
    const to = process.env.SMTP_TO || user;     // send to yourself
    const siteName = process.env.SITE_NAME || "Axon Financial Group";

    // Only set replyTo if it looks like an email (leave undefined otherwise)
    const replyTo =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;

    const subject = `New ${formName} submission — ${name || siteName}`;

    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5">
        <h2 style="margin:0 0 12px">New form submission: ${escapeHtml(formName)}</h2>
        <p><strong>Site:</strong> ${escapeHtml(siteName)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:12px 0" />
        ${Object.entries(data)
          .filter(([k]) => k !== "bot-field")
          .map(
            ([k, v]) =>
              `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(
                Array.isArray(v) ? v.join(", ") : String(v)
              )}</p>`
          )
          .join("")}
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      text: lines || "(no fields)",
      html,
      replyTo, // lets you hit “Reply” to email the sender
    });

    console.log("Email sent for form:", formName, "keys:", Object.keys(data));
    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("submission-created error:", err);
    return { statusCode: 500, body: "Email failed" };
  }
};

// ---- helpers ----
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
