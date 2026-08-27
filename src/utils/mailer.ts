import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_PASS,
  EMAIL_USER,
  CLIENT_URL,
} from "./config.js";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: EMAIL_USER || "",
    pass: EMAIL_PASS || "",
  },
});

export const sendPasswordResetEmail = async (
  toEmail: string,
  resetToken: string,
): Promise<void> => {
  // Construct the secure frontend URL containing the unhashed token
  const resetUrl = `${CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"System Security" <${EMAIL_USER || "noreply@gmail.com"}>`,
    to: toEmail,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your account. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">If the button doesn't work, copy and paste this link into your browser: <br/> ${resetUrl}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send password reset email:", error); // ----log error-----
    throw new Error("Could not dispatch password reset email.");
  }
};
