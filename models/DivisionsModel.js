const mongoose = require("mongoose");

const DivisionsSchema = mongoose.Schema(
    {
        id: { type: String, required: true, unique: true  },
        name: { type: String, required: true},
        bn_name: { type: String, required: true},
        lat: { type: String, required: false, default: ""},
        lon: { type: String, required: false, default: ""},
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
