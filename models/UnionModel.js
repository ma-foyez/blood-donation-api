const mongoose = require("mongoose");

const UnionSchema = mongoose.Schema(
    {
        union_id: { type: String, required: true, unique: true  },
        upzila_id: { type: String, required: true },
        name: { type: String, required: true},
        bn_name: { type: String, required: true},
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
