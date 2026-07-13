/**
 * Creative Solutions Equipment Trading LLC — Cloudflare Worker
 * -----------------------------------------------------------------------------
 * • Serves the static website via the ASSETS binding (frontend).
 * • Handles POST /api/contact — the contact-form backend, delivering enquiries
 *   to info@creativesolutionsuae.com through Resend (https://resend.com).
 *
 * Configure in the Cloudflare dashboard → your Worker → Settings →
 * Variables and Secrets:
 *   RESEND_API_KEY  (Secret)   — required for email delivery. Create at resend.com.
 *   CONTACT_TO      (Variable) — optional, default info@creativesolutionsuae.com
 *   CONTACT_FROM    (Variable) — optional, must be on a Resend-verified domain,
 *                                default "Creative Solutions <noreply@creativesolutionsuae.com>"
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") return json({ success: false, message: "Method not allowed" }, 405);
      return handleContact(request, env);
    }

    // Everything else → static site
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  let d = {};
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) d = await request.json();
    else d = Object.fromEntries((await request.formData()).entries());
  } catch {
    return json({ success: false, message: "Invalid request." }, 400);
  }

  // Honeypot: silently accept bot submissions
  if (d.botcheck) return json({ success: true });

  const name = String(d.name || "").trim();
  const email = String(d.email || "").trim();
  const message = String(d.message || "").trim();
  const phone = String(d.phone || "").trim();
  const subj = String(d.enquiry_subject || "").trim();

  if (!name || !email || !message)
    return json({ success: false, message: "Please fill in your name, email and message." }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return json({ success: false, message: "Please enter a valid email address." }, 400);

  if (!env.RESEND_API_KEY)
    return json({ success: false, message: "Email service not configured yet. Please email info@creativesolutionsuae.com directly." }, 503);

  const to = env.CONTACT_TO || "info@creativesolutionsuae.com";
  const from = env.CONTACT_FROM || "Creative Solutions <noreply@creativesolutionsuae.com>";
  const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
  const html =
    `<h2 style="font-family:Arial,sans-serif;color:#0b2a4a">New website enquiry</h2>` +
    `<table style="font-family:Arial,sans-serif;font-size:14px;color:#0b2a4a">` +
    `<tr><td><strong>Name:</strong></td><td>${esc(name)}</td></tr>` +
    `<tr><td><strong>Email:</strong></td><td>${esc(email)}</td></tr>` +
    (phone ? `<tr><td><strong>Phone:</strong></td><td>${esc(phone)}</td></tr>` : "") +
    (subj ? `<tr><td><strong>Subject:</strong></td><td>${esc(subj)}</td></tr>` : "") +
    `</table>` +
    `<p style="font-family:Arial,sans-serif;font-size:14px;color:#0b2a4a"><strong>Message:</strong></p>` +
    `<p style="font-family:Arial,sans-serif;font-size:14px;color:#0b2a4a">${esc(message).replace(/\n/g, "<br>")}</p>` +
    `<hr><p style="font-family:Arial,sans-serif;font-size:12px;color:#8a97a6">Sent from creativesolutionsuae.com</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: subj ? `Website enquiry: ${subj}` : `New enquiry from ${name}`,
        html,
      }),
    });
    if (r.ok) return json({ success: true });
    return json({ success: false, message: "We couldn't send your message right now. Please try again." }, 502);
  } catch {
    return json({ success: false, message: "Server error. Please try again shortly." }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
