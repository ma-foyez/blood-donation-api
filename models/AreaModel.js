const mongoose = require("mongoose");

const AreaSchema = mongoose.Schema(
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
        collection: "areas",
        timestamps: true,
        versionKey: false,
    }
);

const AreaModel = mongoose.model("AreaModel", AreaSchema);

module.exports = AreaModel;
