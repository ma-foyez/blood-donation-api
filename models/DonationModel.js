const mongoose = require("mongoose");

const DonationSchema = mongoose.Schema(
    {
        donation_date: { type: Date, required: true },
        donation_place: { type: String, required: true },
        donar_name: { type: String, required: true },
        donar_id: { type: String, required: true },
    },
    {
        collection: "donation_history",
        timestamps: true,
        versionKey: false,
    }
);

const DonationModel = mongoose.model("DonationModel", DonationSchema);

module.exports = DonationModel;
