// const fetch = require('node-fetch');
const asyncHandler = require("express-async-handler");

const OtpModel = require("../models/OtpModel");

const storeOTP = asyncHandler(async (req, res) => {
    const { mobile, otp } = req;

    if (!mobile) {
        res.status(400).json({
            status: 400,
            message: `Please provide a valid mobile number`,
        });
        return;
    }

    // Check if an OTP exists for the provided mobile number
    const existingOTP = await OtpModel.findOne({ mobile });

    // If an OTP exists and its expiration time is later than the current time
    if (existingOTP && existingOTP.expire_time > new Date()) {
        // Calculate the remaining time until OTP expiration
        const remainingTime = Math.ceil((existingOTP.expire_time - new Date()) / (1000 * 60)); // Convert milliseconds to minutes
        res.status(400).json({
            status: 400,
            message: `An OTP has already been sent to you. Please try again after ${remainingTime} minutes.`,
        });
        return;
    }

    // Set expiration time to 5 minutes from now
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5);

    const storeData = {
        mobile: mobile,
        otp: otp,
        expire_time: expireTime
    };

    try {
        const otpStored = await OtpModel.create(storeData);
        if (otpStored) {
            res.status(200).json({
                status: 200,
                expire_time: otpStored.expire_time,
                message: `An OTP has been sent to ${maskMobile(mobile)}`,
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
    return res;
});


const maskMobile = (mobile) => {
    const visibleDigits = 3; // Number of visible digits at the beginning and end
    const maskedLength = mobile.length - (visibleDigits * 2); // Number of digits to be masked
    const maskedPart = '*'.repeat(maskedLength);
    const visibleStart = mobile.substring(0, visibleDigits);
    const visibleEnd = mobile.substring(mobile.length - visibleDigits);
    return `${visibleStart}${maskedPart}${visibleEnd}`;
};

module.exports = { storeOTP }