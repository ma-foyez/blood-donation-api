const mongoose = require("mongoose");

const OtpSChema = mongoose.Schema(
    {
        mobile: { type: String, required: true },
        otp: { type: String, required: true },
        expire_time: { type: Date, required: true },
    },
    {
        collection: "otps",
        timestamps: true,
        versionKey: false,
    }
);

const OtpModel = mongoose.model("OtpModel", OtpSChema);

module.exports = OtpModel;
