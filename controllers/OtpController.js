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

    // const otp = Math.floor(100000 + Math.random() * 900000);

    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5); // Set expiration time to 5 minutes from now

    const storeData = {
        mobile: mobile, // Mask mobile number before storing
        otp: otp,
        expire_time: expireTime
    }
    try {
        const otpStored = await OtpModel.create(storeData);
        if (otpStored) {
            res.status(200).json({
                status: 200,
                message: `An OTP has been sent to ${maskMobile(mobile)}`, // Mask mobile number in response
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