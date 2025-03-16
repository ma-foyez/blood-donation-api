const mongoose = require("mongoose");

const OtpSChema = mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expire_time: { type: Date, required: true },
    is_verified: { type: Boolean, required: false, default: false },
  },
  {
    collection: "otps",
    timestamps: true,
    versionKey: false,
  }
);

const OtpModel = mongoose.model("OtpModel", OtpSChema);

module.exports = OtpModel;
