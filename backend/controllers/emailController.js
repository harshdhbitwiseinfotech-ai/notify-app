const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Send email
// @route   POST /api/email/send
// @access  Public (or protect with auth if needed)
const sendEmail = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = {
  sendEmail,
};