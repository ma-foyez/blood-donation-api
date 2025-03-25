const asyncHandler = require("express-async-handler");
const Auth = require("../models/AuthModal");
const { getDivisionByID, getDistrictByID, getAreaByID } = require("../_utils/_helper/getAddressById");
const DonationModel = require("../models/DonationModel");

const MIN_DAYS_BETWEEN_DONATIONS = 120;
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

/**
 * Get All Donation History
 */
const searchBloods = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100000;

        const { division_id, district_id, area_id, post_office, blood_group } = req.query;

        // Construct the filter object based on provided parameters
        const filter = { isActive: true, isApproved: true };

        if (division_id) filter['address.division_id'] = parseInt(division_id);
        if (district_id) filter['address.district_id'] = parseInt(district_id);
        if (area_id) filter['address.area_id'] = parseInt(area_id);
        if (post_office) filter['address.post_office'] = { $regex: post_office, $options: 'i' }; // Case-insensitive search

        if (blood_group) {
            // If the last character is neither '+' nor '-', append '+'
            const adjustedBloodGroup = (blood_group.endsWith('+') || blood_group.endsWith('-'))
                ? blood_group
                : `${blood_group}+`;

            // Remove all white spaces from the entire string
            const trimmedBloodGroup = adjustedBloodGroup.replace(/\s/g, '');

            filter['blood_group'] = trimmedBloodGroup;
        }

        // Get the total count of users with the applied filter
        const totalUsers = await Auth.countDocuments(filter);

        // Calculate pagination values
        const pageCount = Math.ceil(totalUsers / limit);
        const skip = (page - 1) * limit;

        // Get paginated users from Auth collection with specified fields and filter
        const authList = await Auth.find(filter)
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
            })
            .sort({ last_donation: -1 }) // Sort by last_donation in descending order (newest first)
            .skip(skip)
            .limit(limit);

        // Replace the address property for each user in authList
        const authListWithUpdatedAddress = await Promise.all(authList.map(async (user) => {
            const getDivision = await getDivisionByID(user.address.division_id);
            const getDistrict = await getDistrictByID(user.address.district_id);
            const getArea = await getAreaByID(user.address.area_id);

            // Calculate totalDonation for the user
            const userDonations = await DonationModel.find({ donar_id: user._id });

            // Set isAvailable based on the last_donation date
            const currentDate = new Date();
            const lastDonationDate = user.last_donation;
            let isAvailable = true;

            if (lastDonationDate !== null) {
                const daysSinceLastDonation = (currentDate - lastDonationDate) / (1000 * 60 * 60 * 24);
                isAvailable = daysSinceLastDonation > MIN_DAYS_BETWEEN_DONATIONS;
            }

            // Replace the address property with the updated values
            return {
                ...user.toObject(), // Convert Mongoose document to plain JavaScript object
                isAvailable: isAvailable,
                totalDonation: userDonations.length,
                address: {
                    division: getDivision.name ?? "",
                    district: getDistrict.name ?? "",
                    area: getArea.name ?? "",
                    post_office: user.address.post_office,
                },
            };
        }));

        // Send the response with pagination information and updated data
        res.status(201).json({
            pagination: {
                total_data: totalUsers,
                total_page: pageCount,
                current_page: page,
                data_load_current_page: authListWithUpdatedAddress.length,
            },
            data: authListWithUpdatedAddress,
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
