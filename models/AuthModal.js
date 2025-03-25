const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { type } = require("express/lib/response");

// Address Schema
const AddressSchema = mongoose.Schema({
    division_id: { type: Number, required: true },
    division: { type: String, required: false },
    district_id: { type: Number, required: true },
    district: { type: String, required: false },
    area_id: { type: Number, required: true },
    area: { type: String, required: false },
    post_office: { type: String, required: true },
});

const AuthSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        dob: { type: Date, required: true },
        blood_group: { type: String, required: true },
        occupation: { type: String, default: "" },
        is_weight_50kg: { type: Boolean, required: true },
        last_donation: { type: Date, required: false, default: "" },
        isActive: { type: Boolean, required: false, default: true },
        // isAvailable: { type: Boolean, required: false, default: true },
        address: { type: AddressSchema, required: true },
        password: { type: String, required: true },
        isApproved: { type: Boolean, require: false, default: false },
        pic: {
            type: String,
            default: function () {
                return "https://www.pngitem.com/pimgs/m/130-1300253_female-user-icon-png-download-user-image-color.png";
            },
        },
        tokens: [{ token: { type: String, required: true } }],
    },
    {
        collection: "users",
        timestamps: true,
        versionKey: false,
    }
);

AuthSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

AuthSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10); // Increase the salt rounds
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Update the 'updated_at' field when the document is updated
AuthSchema.pre('updateOne', function (next) {
    this.update({}, { $set: { updated_at: new Date() } });
    next();
});

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;
