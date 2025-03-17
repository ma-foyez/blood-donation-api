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
const regenerateRegisterOTPMessage = async (email, otp) => {
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
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.response}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, message: error.message };
  }
};



/**
 * Send OTP email for registration
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP to be sent.
 */
const generateResetPasswordOTPMessage = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject: "Resent Message",
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
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.response}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, message: error.message };
  }
};

const generateRegistrationSuccessMessage = async (user) => {
  try {
    // Define your app details
    const appName = "Rokther Sondhane"
    const primaryColor = "#E53E3E" // Red color for your branding
    const secondaryColor = "#FED7D7" // Light red for accents
    const logoUrl = `${process.env.APP_URL}/images/logo.png` // Path to your logo

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: user.email,
      subject: `Welcome to ${appName} - Registration Successful`,
      text: `Dear ${user.name},\n\nCongratulations! Your registration on ${appName} is successful.\n\nYou can now log in and access our platform to contribute to life-saving efforts. Thank you for joining us!\n\nIf you have any questions, feel free to reach out.\n\nBest regards,\n${appName} Team`, // Plain text version
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; color: #333;">
          <div style="margin-bottom: 20px;">
            <img src="${logoUrl}" alt="${appName} Logo" style="max-width: 150px; height: auto;">
          </div>
          <h1 style="color: ${primaryColor};">Welcome to ${appName}!</h1>
          <div style="background-color: ${secondaryColor}; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>We're thrilled to have you on board! Your registration has been successfully completed.</p>
            <p>You can now log in to your account and start contributing to our life-saving community.</p>
          </div>
          <div style="margin: 20px 0;">
            <a href="${process.env.APP_URL}/login" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: bold; color: #fff; background-color: ${primaryColor}; text-decoration: none; border-radius: 5px;">Log In Now</a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <hr style="margin: 20px 0; border-color: ${secondaryColor};">
          <p style="font-size: 12px; color: #666;">Best regards,<br><strong>${appName} Team</strong></p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Registration success email sent to ${user.email}: ${info.response}`)
    return { success: true, message: "Registration success email sent successfully" }
  } catch (error) {
    console.error("Error sending registration success email:", error)
    return { success: false, message: error.message }
  }
}

module.exports = { sendEmail, regenerateRegisterOTPMessage, generateRegistrationSuccessMessage, generateResetPasswordOTPMessage };
