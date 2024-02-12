const mongoose = require("mongoose");

const UpzilaSchema = mongoose.Schema(
    {
        parent_id: { type: String, required: true, },
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        bn_name: { type: String, required: true },
        lat: { type: String, required: false, default: ""},
        lon: { type: String, required: false, default: ""},
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
