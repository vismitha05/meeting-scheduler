import nodemailer from "nodemailer";

export interface MeetingConfirmedEmailInput {
  to: string;
  attendeeEmail: string;
  date: string;
  time: string;
  location: string; // "Google Meet"
  meetingLink: string;
  rescheduleUrl: string;
  cancelUrl: string;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailHtmlTemplate(input: MeetingConfirmedEmailInput) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 10px 0; color: #475569; font-size: 13px; width: 140px;">${escapeHtml(
        label,
      )}</td>
      <td style="padding: 10px 0; color: #0f172a; font-size: 13px; font-weight: 600;">${escapeHtml(
        value,
      )}</td>
    </tr>
  `;

  return `
  <div style="background:#f1f5f9;padding:24px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="padding:20px 22px;background:#0f172a;color:#ffffff;">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#cbd5e1;font-weight:700;">
          Meeting Confirmed
        </div>
        <div style="margin-top:6px;font-size:16px;font-weight:700;">
          New meeting booked with Victoire Serruys
        </div>
      </div>

      <div style="padding:18px 22px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row("Email address", input.attendeeEmail)}
          ${row("Date", input.date)}
          ${row("Time", input.time)}
          ${row("Location", input.location)}
          ${row("Meeting link", input.meetingLink)}
        </table>

        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
          <a href="${escapeHtml(
            input.rescheduleUrl,
          )}" style="display:inline-block;padding:10px 14px;border-radius:999px;background:#f59e0b;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;">
            Reschedule
          </a>
          <a href="${escapeHtml(
            input.cancelUrl,
          )}" style="display:inline-block;padding:10px 14px;border-radius:999px;border:1px solid #cbd5e1;background:#ffffff;color:#0f172a;text-decoration:none;font-weight:700;font-size:13px;">
            Cancel
          </a>
        </div>

        <div style="margin-top:18px;color:#64748b;font-size:12px;line-height:1.5;">
          If you didn’t request this booking, you can cancel using the button above.
        </div>
      </div>
    </div>
  </div>
  `;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

function getSmtpConfig(): SmtpConfig {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    const port = Number(smtpPort);
    return {
      host: smtpHost,
      port,
      secure: port === 465,
      user: smtpUser,
      pass: smtpPass,
      from: process.env.SMTP_FROM ?? process.env.EMAIL_FROM ?? smtpUser,
    };
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    return {
      host: process.env.EMAIL_HOST ?? "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT ?? "465"),
      secure: (process.env.EMAIL_PORT ?? "465") === "465",
      user: emailUser,
      pass: emailPass,
      from: process.env.EMAIL_FROM ?? emailUser,
    };
  }

  throw new Error(
    "Missing SMTP credentials. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS or EMAIL_USER/EMAIL_PASS.",
  );
}

export async function sendMeetingConfirmedEmail(input: MeetingConfirmedEmailInput) {
  const { host, port, secure, user, pass, from } = getSmtpConfig();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const subject = "Meeting Confirmed";
  const html = emailHtmlTemplate(input);

  console.log(
    `[email] Sending confirmation email from "${from}" to "${input.to}" using ${host}:${port}`,
  );

  await transporter.verify();
  console.log("[email] SMTP connection verified.");

  const info = await transporter.sendMail({
    from,
    to: input.to,
    subject,
    html,
    text: [
      "New meeting booked with Victoire Serruys",
      "",
      `Email address: ${input.attendeeEmail}`,
      `Date: ${input.date}`,
      `Time: ${input.time}`,
      `Location: ${input.location}`,
      `Meeting link: ${input.meetingLink}`,
      "",
      `Reschedule: ${input.rescheduleUrl}`,
      `Cancel: ${input.cancelUrl}`,
    ].join("\n"),
  });

  console.log(
    `[email] Confirmation email sent successfully. messageId=${info.messageId}`,
  );

  return { messageId: info.messageId };
}
