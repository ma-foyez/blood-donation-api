const mongoose = require("mongoose");

const UpzilaSchema = mongoose.Schema(
    {
        upzila_id: { type: String, required: true, unique: true },
        district_id: { type: String, required: true, },
        name: { type: String, required: true },
        bn_name: { type: String, required: true },
        url: { type: String, required: false, default: "" },
    },
    {
        collection: "upzilas",
        timestamps: true,
        versionKey: false,
    }
);

const UpzilaModel = mongoose.model("UpzilaModel", UpzilaSchema);

module.exports = UpzilaModel;
