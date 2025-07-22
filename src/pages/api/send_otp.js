// pages/api/send-otp.js
import { sendOTPEmail } from "@/lib/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Thiếu email hoặc mã OTP." });
  }

  try {
    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "OTP đã được gửi." });
  } catch (err) {
    console.error("Lỗi gửi email:", err);
    return res.status(500).json({ message: "Gửi OTP thất bại." });
  }
}
