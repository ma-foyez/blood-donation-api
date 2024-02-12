const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const Auth = require("../models/AuthModal");
const { generateToken } = require("../config/generateToken");
const { getDivisionByID, getDistrictByID, getUpzilaByID, getUnionByID } = require("../_utils/_helper/getAddressById");


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
    const userExistsWithNumber = await Auth.findOne({ mobile: requestBody.mobile });
    const userExitsWithEmail = await Auth.findOne({ email: requestBody.email });

    if (userExistsWithNumber) {
        res.status(400).json({
            status: 400,
            message: "You already have an account with this number.",
        });
        return;
    }
    if (userExitsWithEmail) {
        res.status(400).json({
            status: 400,
            message: "You already have an account with this email.",
        });
        return;
    }

    // Create a new user with all the provided fields
    const user = await Auth.create(requestBody);

    if (user) {

        const getDivision = await getDivisionByID(user.address.division_id);
        const getDistrict = await getDistrictByID(user.address.district_id);
        const getArea = await getUpzilaByID(user.address.area_id);

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
                mobile: user.mobile,
                email: user.email,
                dob: user.dob,
                occupation: user.occupation,
                blood_group: user.blood_group,
                is_weight_50kg: user.is_weight_50kg,
                isAvailable: user.isAvailable,
                isActive: user.isActive,
                last_donation: user.last_donation,
                pic: user.pic,
                address: {
                    division: getDivision.name ?? "",
                    district: getDistrict.name ?? "",
                    area: getArea.name ?? "",
                    post_office: user.address.post_office,
                },
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

        const getDivision = await getDivisionByID(user.address.division_id);
        const getDistrict = await getDistrictByID(user.address.district_id);
        const getArea = await getUpzilaByID(user.address.area_id);

        const token = generateToken(user._id);
        user.tokens.push({ token });
        await user.save();

        res.status(200).json({
            status: 200,
            message: "Login successfully.",
            data: {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                dob: user.dob,
                occupation: user.occupation,
                blood_group: user.blood_group,
                isAvailable: user.isAvailable,
                isActive: user.isActive,
                is_weight_50kg: user.is_weight_50kg,
                last_donation: user.last_donation,
                address: {
                    division: getDivision.name ?? "",
                    district: getDistrict.name ?? "",
                    area: getArea.name ?? "",
                    post_office: user.address.post_office,
                },
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

// Update auth user data
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const requestBody = req.body;
    // const requiredFields = ['name', 'mobile', 'dob', 'blood_group', 'is_weight_50kg', 'address', 'password'];
    // Ensure required fields are provided
    const requiredFields = ['name', 'mobile', 'dob', 'blood_group', 'is_weight_50kg', 'address'];
    const missingFields = requiredFields.filter(field => !requestBody[field]);

    if (missingFields.length > 0) {
        res.status(400).json({
            status: 400,
            message: `Please provide all required fields: ${missingFields.join(', ')}`,
        });
        return;
    }

    try {
        // Find the user by ID
        const user = await Auth.findById(userId);

        if (!user) {
            res.status(404).json({
                status: 404,
                message: "User does not exit.",
            });
            return;
        }

        // Check if user already exists
        const userExistsWithNumber = await Auth.findOne({ mobile: requestBody.mobile });

        if (userExistsWithNumber) {
            res.status(400).json({
                status: 400,
                message: "This mobile number is already associated with another account.",
            });
            return;
        }

        // Update user profile fields
        user.name = requestBody.name;
        user.mobile = requestBody.mobile;
        user.dob = requestBody.dob;
        user.blood_group = requestBody.blood_group;
        user.is_weight_50kg = requestBody.is_weight_50kg;
        user.address = requestBody.address;
        user.occupation = requestBody.occupation;

        // Save the updated user
        await user.save();

        res.status(200).json({
            status: 200,
            message: "User profile updated successfully",
            data: {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                dob: user.dob,
                occupation: user.occupation,
                blood_group: user.blood_group,
                is_weight_50kg: user.is_weight_50kg,
                isAvailable: user.isAvailable,
                isActive: user.isActive,
                last_donation: user.last_donation,
                pic: user.pic,
                address: user.address,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
});


const updateProfileActive = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { isActive } = req.body;

    try {
        // Find the user by ID
        const user = await Auth.findById(userId);

        if (!user) {
            res.status(404).json({
                status: 404,
                message: "User does not exit.",
            });
            return;
        }

        // Update isActive status
        user.isActive = isActive;

        // Save the updated user
        await user.save();

        res.status(200).json({
            status: 200,
            message: `User profile is now ${isActive ? 'active' : 'inactive'}`,
            data: {
                _id: user._id,
                isActive: user.isActive,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
});


module.exports = { registerUser, authUser, logout, updateUserProfile, updateProfileActive }