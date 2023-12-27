const mongoose = require("mongoose");

const DivisionsSchema = mongoose.Schema(
    {
        division_code: { type: String, required: true, unique: true  },
        name: { type: String, required: true},
        bn_name: { type: String, required: true},
        coordinates: { type: String, required: true},
        url: { type: String, required: true},
    },
    {
        collection: "divisions",
        timestamps: true,
        versionKey: false,
    }
);


const DivisionModel = mongoose.model("DivisionModel", DivisionsSchema);

module.exports = DivisionModel;
