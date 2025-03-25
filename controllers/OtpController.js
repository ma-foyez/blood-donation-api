const asyncHandler = require("express-async-handler");

const OtpModel = require("../models/OtpModel");
const Auth = require("../models/AuthModal");
const {
  sendEmail,
  regenerateRegisterOTPMessage,
  generateResetPasswordOTPMessage,
} = require("../_utils/_helper/emailService"); // Replace SMS service with email service
const maskEmail = require("../_utils/_helper/maskEmail");
const { keys } = require("../_utils/keys");
const { generateOTP } = require("../_utils/_helper/OtpGenerate");

const storeOTP = asyncHandler(async (req, res) => {
  const { email } = req;
  if (!email) {
    res.status(400).json({
      status: 400,
      message: "Please provide a valid email address",
    });
    return;
  }

  const existingOTP = await OtpModel.findOne({ email });
  const existingUser = await Auth.findOne({ email });
  if (existingOTP && existingOTP.expire_time > new Date() && existingOTP.is_verified === false) {
    const remainingTime = Math.ceil((existingOTP.expire_time - new Date()) / (1000 * 60));
    res.status(400).json({
      status: 400,
      message: `An OTP has already been sent to your email. Please try again after ${remainingTime} minutes.`,
    });
    return;
  }

  const otp = process.env.SMS_MODE === "prod" ? generateOTP() : process.env.TEST_OTP;
  const expireTime = new Date();
  expireTime.setMinutes(expireTime.getMinutes() + keys.OTP_VALIDITY_DURATION_MINUTES);

  const storeData = { email, otp, is_verified: false, expire_time: expireTime };

  try {
    let otpStored;
    if (existingOTP) {
      otpStored = await OtpModel.findOneAndUpdate({ email }, storeData, { new: true });
    } else {
      otpStored = await OtpModel.create(storeData);
    }

    if (otpStored) {
      if (existingUser.isApproved === true) {
        generateResetPasswordOTPMessage(otpStored.email, otpStored.otp);
      } else {
        regenerateRegisterOTPMessage(otpStored.email, otpStored.otp);
      }
      res.status(200).json({
        status: 200,
        expire_time: otpStored.expire_time,
        message: `An OTP has been sent to ${maskEmail(email)}`,
      });
    } else {
      res.status(400).json({ status: 400, message: "Failed to send OTP" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

// const regenerateOtp = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const userExistsWithEmail = await Auth.findOne({ email });

//   console.log('userExistsWithEmail :>> ', userExistsWithEmail);
//   if (!userExistsWithEmail) {
//     res.status(400).json({
//       status: 400,
//       message: "User doesn't exist with this email!",
//     });
//     return;
//   }

//   // If user exists with the provided email, call the storeOTP method
//   const otp = generateOTP();
//   const data = {
//     email,
//     otp: process.env.SMS_MODE === "prod" ? otp : process.env.TEST_OTP,
//   };

//   try {
//     // const isStoreOTP = await storeOTP({ body: data }, res);
//     const isStoreOTP = await storeOTP({ email, otp }, res);

//     // If OTP is successfully stored, send the email
//     if (process.env.SMS_MODE === "prod" && isStoreOTP.status(200)) {
//       sendEmail(); // Update to send an email
//     }
//   } catch (error) {
//     console.error("Error occurred while storing OTP:", error);
//     res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//     });
//   }
// });

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate required fields
  if (!email || !otp) {
    return res.status(400).json({
      status: 400,
      message: "Email and OTP are required.",
    });
  }

  try {
    // Fetch user and OTP details in parallel
    const [user, findOtp] = await Promise.all([
      Auth.findOne({ email }),
      OtpModel.findOne({ email, otp }),
    ]);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found. Please register first.",
      });
    }

    // Check if OTP exists
    if (!findOtp) {
      return res.status(400).json({
        status: 400,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    }
    // Check if OTP is already used
    if (findOtp.is_verified) {
      return res.status(400).json({
        status: 400,
        message: "This OTP has already been used. Please request a new one.",
      });
    }


    // Check if OTP is expired
    if (findOtp.expire_time < new Date()) {
      return res.status(400).json({
        status: 400,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Mark OTP as verified (if applicable in your logic)
    await OtpModel.updateOne({ email }, { is_verified: true });

    return res.status(200).json({
      status: 200,
      message: "OTP verified successfully.",
      data: null
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});


module.exports = { storeOTP, verifyOtp };
