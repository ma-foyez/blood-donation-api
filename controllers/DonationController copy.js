const asyncHandler = require("express-async-handler");
const Auth = require("../models/AuthModal");
const Donation = require("../models/DonationModel");
const MIN_DAYS_BETWEEN_DONATIONS = 120;
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
/**
 * Store New Donation History
 */

const storeNewDonationHistory = asyncHandler(async (req, res) => {
    const { donation_date, donation_place } = req.body;
    const auth_user = req.user.id;
    let positiveDaysSinceLastDonation = 0;
    if (!donation_date || !donation_place) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const getUserInfo = await Auth.findOne({ _id: auth_user });

    if (!getUserInfo) {
        res.status(400);
        throw new Error("Unauthenticated Access!");
    }

    // Check if the user has previous donations
    const existingDonation = await Donation.findOne(
        { donar_id: auth_user, donation_date: new Date(donation_date) },
        { donation_date: 1 }
    );

    if (existingDonation) {
        res.status(400);
        throw new Error(`A donation with the date ${donation_date} already exists.`);
    }

    const nearestDonation = await Donation.findOne(
        { donar_id: auth_user, donation_date: { $ne: new Date(donation_date) } },
        { donation_date: 1 },
        { sort: { donation_date: 1 } }
    );

    // Check if the user has previous donations
    // const StoredLastDonation = await Donation.findOne(
    //     { donar_id: auth_user },
    //     { donation_date: 1 },
    //     { sort: { donation_date: -1 } }
    // );

    if (nearestDonation) {
        // Ensure both donation_date and lastDonation.donation_date are Date objects
        const currentDonationDate = new Date(donation_date);
        const lastDonationDate = new Date(nearestDonation.donation_date);

        // Calculate the difference in days between the last donation and the current request
        const millisecondsInADay = 24 * 60 * 60 * 1000;
        const daysSinceLastDonation = Math.floor(
            (currentDonationDate.getTime() - lastDonationDate.getTime()) / millisecondsInADay
        );

        // If daysSinceLastDonation is negative, convert it to a positive value
        positiveDaysSinceLastDonation = daysSinceLastDonation < 0 ? Math.abs(daysSinceLastDonation)
            : daysSinceLastDonation;

        if (positiveDaysSinceLastDonation < MIN_DAYS_BETWEEN_DONATIONS) {
            res.status(400);
            throw new Error("Your donation is not acceptable. It's too soon since your last donation.");
        }
    }

    // Store new transaction
    const createDonation = await Donation.create({
        donar_id: auth_user,
        donar_name: getUserInfo.name,
        donation_date,
        donation_place,
    });

    const getNearestDonation = await Donation.findOne(
        { donar_id: auth_user },
        { donation_date: 1 },
        { sort: { donation_date: -1 } }
    );
    getUserInfo.last_donation = getNearestDonation.donation_date;
    await getUserInfo.save();

    if (createDonation) {
        res.status(200).json({
            data: {
                _id: createDonation._id,
                donar_id: createDonation.donar_id,
                donar_name: getUserInfo.name,
                donar_mobile: getUserInfo.mobile,
                blood_group: getUserInfo.blood_group,
                donation_date: createDonation.donation_date,
                donation_place: createDonation.donation_place,
            },
            status: 200,
            message: "You have successfully recorded a new donation history!",
        });
    } else {
        res.status(400);
        throw new Error("Failed to record new donation history!");
    }
});




/**
 * Get All Donation History
 */
const getAllDonationHistory = asyncHandler(async (req, res) => {
    const auth_user = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let countPromise, itemsPromise;

    const donationQuery = { donar_id: auth_user };

    if (status && status.trim() !== '') {
        donationQuery.status = status;
    }

    countPromise = Donation.countDocuments(donationQuery);

    // Modify the query to include sorting by 'createdAt' in descending order
    itemsPromise = Donation.find(donationQuery).sort({ createdAt: -1 }).limit(limit).skip(page > 1 ? skip : 0);

    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = Math.ceil(count / limit);
    const viewCurrentPage = count > limit ? pageCount : page;

    if (!items) {
        res.status(400);
        throw new Error("Failed to fetch donation history.");
    }

    res.status(201).json({
        pagination: {
            total_data: count,
            total_page: pageCount,
            current_page: page,
            data_load_current_page: items.length,
        },
        data: items,
        status: 201,
        message: "Donation history fetched successfully!",
    });
});

/**
 * Delete Donation by Auth User
//  */
const deleteDonationData = asyncHandler(async (req, res) => {
    const auth_user = req.user.id;

    const removeTransaction = await Donation.findOneAndDelete({
        _id: req.params.id,
        donar_id: auth_user
    });

    if (removeTransaction) {
        res.status(200).json({
            status: 200,
            message: "Donation deleted successfully!"
        });
    } else {
        res.status(400);
        throw new Error("Failed to delete donation!");
    }
});

module.exports = { storeNewDonationHistory, getAllDonationHistory, deleteDonationData }