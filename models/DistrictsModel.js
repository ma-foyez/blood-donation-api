const mongoose = require("mongoose");

const DistrictSchema = mongoose.Schema(
    {
        parent_id: { type: String, required: true},
        id: { type: String, required: true, unique: true  },
        name: { type: String, required: true},
        bn_name: { type: String, required: true},
        lat: { type: String, required: false, default: ""},
        lon: { type: String, required: false, default: ""},
        url: { type: String, required: true},
    },
    {
        collection: "districts",
        timestamps: true,
        versionKey: false,
    }
);

const DistrictModel = mongoose.model("DistrictModel", DistrictSchema);

module.exports = DistrictModel;
