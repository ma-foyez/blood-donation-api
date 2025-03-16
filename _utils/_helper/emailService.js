const nodemailer = require("nodemailer");
const dotenv = require("dotenv");


dotenv.config();

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail", 
  // port: 587,
  // secure: true,
  auth: {
    user: process.env.SMPT_MAIL, // Email address
    pass: process.env.SMPT_APP_PASS, // App password
  },
});

// Function to send email
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.SMPT_MAIL, // Sender email
      to, // Recipient email
      subject, // Email subject
      text, // Plain text message
      ...(html && { html }), // Add HTML content if provided
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Send OTP email for registration
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP to be sent.
 */
const regenerateOtpMessage = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject: "Verify Your Registration on Blood BD",
      text: `Welcome to Blood BD! \n\nWe're excited to have you on board. Please use the following OTP to complete your registration:\n\n${otp}\n\nThis code will expire in 5 minutes. If you didn’t request this email, you can safely ignore it.`, // Plain text version
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h1>Welcome to Blood BD!</h1>
          <p>We're thrilled to have you join us. To complete your registration, please use the following OTP:</p>
          <div style="margin: 20px 0; padding: 20px; font-size: 36px; font-weight: bold; color: #2C3E50; background-color: #F3F3F3; border: 2px solid #DDD; display: inline-block;">
            ${otp}
          </div>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn’t request this email, you can safely ignore it.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Blood BD Team</p>
        </div>
      `,
    };

    console.log('transporter :>> ', transporter);

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.response}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, message: error.message };
  }
};

module.exports = { sendEmail, regenerateOtpMessage };
