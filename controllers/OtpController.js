const asyncHandler = require("express-async-handler");

const OtpModel = require("../models/OtpModel");
const Auth = require("../models/AuthModal");
const {
  sendEmail,
  regenerateRegisterOTPMessage,
} = require("../_utils/_helper/emailService"); // Replace SMS service with email service
const maskEmail = require("../_utils/_helper/maskEmail");
const { keys } = require("../_utils/keys");
const { generateOTP } = require("../_utils/_helper/OtpGenerate");

const storeOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req;
  if (!email) {
    res.status(400).json({
      status: 400,
      message: "Please provide a valid email address",
    });
    return;
  }

  const userExistsWithEmail = await Auth.findOne({ email });
  const existingOTP = await OtpModel.findOne({ email });

  if (existingOTP && existingOTP.expire_time > new Date() && existingOTP.is_verified === false) {
    // Calculate the remaining time until OTP expiration
    const remainingTime = Math.ceil(
      (existingOTP.expire_time - new Date()) / (1000 * 60)
    );
    res.status(400).json({
      status: 400,
      message: `An OTP has already been sent to your email. Please try again after ${remainingTime} minutes.`,
    });
    return;
  }

  // Set expiration time to 5 minutes from now
  const expireTime = new Date();
  expireTime.setMinutes(expireTime.getMinutes() + keys.OTP_VALIDITY_DURATION_MINUTES);

  const storeData = {
    email,
    otp,
    is_verified: false,
    expire_time: expireTime,
  };

  try {
    // const otpStored = await OtpModel.create(storeData);
    let otpStored

    if (existingOTP) {
      // If OTP exists (expired or not), update it instead of creating a new one
      otpStored = await OtpModel.findOneAndUpdate({ email }, storeData, { new: true },)
    } else {
      // If no OTP exists for this email, create a new one
      otpStored = await OtpModel.create(storeData)
    }
    if (otpStored) {
      // if (userExistsWithEmail && userExistsWithEmail.isApproved) {
      //   generateResetPasswordOTPMessage(otpStored.email, otpStored.otp);
      // } else {
      //   regenerateRegisterOTPMessage(otpStored.email, otpStored.otp);
      // }
       generateResetPasswordOTPMessage(otpStored.email, otpStored.otp);
      res.status(200).json({
        status: 200,
        expire_time: otpStored.expire_time,
        message: `An OTP has been sent to ${maskEmail(email)}`,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Failed to send OTP",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
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

const matchOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const findOtpByEmail = await OtpModel.findOne({ email, otp });

  if (!findOtpByEmail) {
    return res.status(400).json({
      status: 400,
      message: "OTP doesn't match!",
    });
  }

  const currentTime = new Date();
  if (
    process.env.SMS_MODE === "prod" &&
    findOtpByEmail.expire_time < currentTime
  ) {
    return res.status(400).json({
      status: 400,
      message: "OTP has expired!",
    });
  } else {
    const similarOtps = await OtpModel.find({ otp });
    const validOtps = similarOtps.filter(
      (otp) => otp.expire_time > currentTime
    );

    if (validOtps.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "OTP has expired!",
      });
    }
  }

  return res.status(200).json({
    status: 200,
    message: "OTP verified successfully!",
  });
});

module.exports = { storeOTP, matchOtp };
