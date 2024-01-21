const asyncHandler = require("express-async-handler");
const Auth = require("../models/AuthModal");
const Donation = require("../models/DonationModel");

/**
 * Get All Donation History
 */
const searchBloods = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Get the total count of users
        const totalUsers = await Auth.countDocuments();

        // Calculate pagination values
        const pageCount = Math.ceil(totalUsers / limit);
        const skip = (page - 1) * limit;

        // Get paginated users from Auth collection with specified fields
        const authList = await Auth.find({})
            .select({
                _id: 1,
                name: 1,
                mobile: 1,
                email: 1,
                dob: 1,
                blood_group: 1,
                occupation: 1,
                is_weight_50kg: 1,
                last_donation: 1,
                address: 1,
                pic: 1,
                created_at: 1,
                createdAt: 1,
                updatedAt: 1,
            })
            .skip(skip)
            .limit(limit);

        // Send the response with pagination information and updated data
        res.status(201).json({
            pagination: {
                total_data: totalUsers,
                total_page: pageCount,
                current_page: page,
                data_load_current_page: authList.length,
            },
            data: authList,
            status: 201,
            message: "Donar search successfully!",
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(400).json({
            status: 400,
            message: "Failed search donar",
        });
    }
};

module.exports = { searchBloods };

