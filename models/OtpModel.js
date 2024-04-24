const mongoose = require("mongoose");

const OtpSChema = mongoose.Schema(
    {
        mobile: { type: String, required: true },
        otp: { type: String, required: true },
        expired_at: { type: Date, required: true },
    },
    {
        collection: "otp",
        timestamps: true,
        versionKey: false,
    }
);

const OtpModel = mongoose.model("OtpModel", OtpSChema);

module.exports = OtpModel;
