const mongoose = require("mongoose");

const DistrictSchema = mongoose.Schema(
    {
        district_id: { type: String, required: true, unique: true  },
        division_id: { type: String, required: true},
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
