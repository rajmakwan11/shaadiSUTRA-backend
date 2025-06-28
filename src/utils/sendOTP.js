const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // full email
      pass: process.env.EMAIL_PASS, // 16-digit app password
    },
  });

  const mailOptions = {
    from: `"ShaadiSutra 👰" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  // optional debug
  await transporter.verify();

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
