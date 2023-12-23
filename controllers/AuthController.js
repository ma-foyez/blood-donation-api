const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const Auth = require("../models/AuthModal");
const { generateToken } = require("../config/generateToken");


const registerUser = asyncHandler(async (req, res) => {
    const requestBody = req.body;

    // Ensure required fields are provided
    const requiredFields = ['name', 'mobile', 'dob', 'blood_group', 'is_weight_50kg', 'address', 'password'];
    const missingFields = requiredFields.filter(field => !requestBody[field]);

    if (missingFields.length > 0) {
        res.status(400).json({
            status: 400,
            message: `Please provide all required fields: ${missingFields.join(', ')}`,
        });
        return;
    }

    // Check if user already exists
    const userExists = await Auth.findOne({ mobile: requestBody.mobile });

    if (userExists) {
        res.status(400).json({
            status: 400,
            message: "You already have an account. Please try to login!",
        });
        return;
    }

    // Create a new user with all the provided fields
    const user = await Auth.create(requestBody);

    if (user) {
        // Generate token, save it to user, and save the user
        const token = generateToken(user._id);
        user.tokens.push({ token });
        await user.save();

        res.status(200).json({
            status: 200,
            message: "You have been successfully created a new account",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                dob: user.dob,
                occupation: user.occupation,
                blood_group: user.blood_group,
                address: user.address,
                is_weight_50kg: user.is_weight_50kg,
                pic: user.pic,
                access_token: token,
            },
           
        });
    } else {
        res.status(400).json({
            status: 400,
            message: "Failed to create a new user",
        });
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body;

    const user = await Auth.findOne({ mobile });

    if (user && (await user.matchPassword(password))) {

        const token = generateToken(user._id);
        user.tokens.push({ token });
        await user.save();

        res.status(200).json({
            status: 200,
            message: "Login successfully.",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                dob: user.dob,
                occupation: user.occupation,
                blood_group: user.blood_group,
                address: user.address,
                is_weight_50kg: user.is_weight_50kg,
                pic: user.pic,
                access_token: token,
            },
        });
    } else {
        res.status(400);
        throw new Error("Mobile or Password do not match!");
    }
})

/**
 * Logout User
 */
const logout = asyncHandler(async (req, res) => {
    const user = req.user; // Assuming the authenticated user is available in req.user
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is provided in the "Authorization" header as a bearer token
    // Remove the token from the user's tokens array
    const getUser = await Auth.findOne({ _id: user.id });
    getUser.tokens = getUser.tokens.filter((tokenObj) => tokenObj.token !== token);

    await getUser.save();
    res.status(200).json({
        status: 200,
        message: "Logout successful.",
    });
});

module.exports = { registerUser, authUser, logout }