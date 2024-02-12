const mongoose = require("mongoose");

const UnionSchema = mongoose.Schema(
    {
        parent_id: { type: String, required: true },
        id: { type: String, required: true, unique: true  },
        name: { type: String, required: true},
        bn_name: { type: String, required: true},
        lat: { type: String, required: false, default: ""},
        lon: { type: String, required: false, default: ""},
        url: { type: String, required: false, default: ""},
    },
    {
        collection: "unions",
        timestamps: true,
        versionKey: false,
    }
);

const UnionModel = mongoose.model("UnionModel", UnionSchema);

module.exports = UnionModel;
