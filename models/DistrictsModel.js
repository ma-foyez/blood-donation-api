const mongoose = require("mongoose");

const DistrictSchema = mongoose.Schema(
    {
        division_code: { type: String, required: true},
        district_code: { type: String, required: true, unique: true  },
        name: { type: String, required: true},
        bn_name: { type: String, required: true},
        lat: { type: String, required: true},
        lon: { type: String, required: true},
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
