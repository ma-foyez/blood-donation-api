const asyncHandler = require("express-async-handler");
const Auth = require("../models/AuthModal");
const Donation = require("../models/DonationModel");

const MIN_DAYS_BETWEEN_DONATIONS = 90;
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

const errorResponse = (res, status, message) => {
    res.status(status).json({
        status,
        message,
    });
    throw new Error(message);
};

const storeNewDonationHistory = asyncHandler(async (req, res) => {
    const { donation_date, donation_place } = req.body;
    const { id: auth_user } = req.user;

    if (!donation_date || !donation_place) {
        return errorResponse(res, 400, "Please provide all required fields");
    }

    const getUserInfo = await Auth.findOne({ _id: auth_user });

    if (!getUserInfo) {
        return errorResponse(res, 400, "Unauthenticated Access!");
    }

    const existingDonation = await Donation.findOne(
        { donar_id: auth_user, donation_date: new Date(donation_date) },
        { donation_date: 1 }
    );

    if (existingDonation) {
        return errorResponse(res, 400, `A donation with the date ${donation_date} already exists.`);
    }

    const nearestDonation = await Donation.findOne(
        { donar_id: auth_user, donation_date: { $lte: new Date(donation_date) } },
        { donation_date: 1 },
        { sort: { donation_date: -1 } }
    );

    // const nearestDonation = await Donation.findOne(
    //     { donar_id: auth_user, donation_date: { $ne: new Date(donation_date) } },
    //     { donation_date: 1 },
    //     { sort: { donation_date: 1 } }
    // );

    if (nearestDonation) {
        const currentDonationDate = new Date(donation_date);
        const lastDonationDate = new Date(nearestDonation.donation_date);

        const daysBetweenDonations = Math.floor(
            (currentDonationDate.getTime() - lastDonationDate.getTime()) / MILLISECONDS_IN_A_DAY
        );

        if (daysBetweenDonations < MIN_DAYS_BETWEEN_DONATIONS) {
            return errorResponse(
                res,
                400,
                "Your donation is not acceptable. It's too soon since your last donation."
            );
        }
        // if (daysBetweenDonations < 0) {
        //     if (Math.abs(daysBetweenDonations) < MIN_DAYS_BETWEEN_DONATIONS) {
        //         return errorResponse(
        //             res,
        //             400,
        //             "Your donation is not acceptable. It's too soon since your last donation."
        //         );
        //     }
        // }
    }

    const createDonation = await Donation.create({
        donar_id: auth_user,
        // donar_name: getUserInfo.name,
        donation_date,
        donation_place,
    });

    const getNearestDonation = await Donation.findOne(
        { donar_id: auth_user },
        { donation_date: 1 },
        { sort: { donation_date: -1 } }
    );

    if (getNearestDonation) {
        getUserInfo.last_donation = getNearestDonation.donation_date;
        await getUserInfo.save();
    }

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
        return errorResponse(res, 400, "Failed to record new donation history!");
    }
});

const getAllDonationHistory = asyncHandler(async (req, res) => {
    const auth_user = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let countPromise, itemsPromise;

    const donationQuery = { donar_id: auth_user };

    if (status && status.trim() !== "") {
        donationQuery.status = status;
    }

    countPromise = Donation.countDocuments(donationQuery);

    itemsPromise = Donation.find(donationQuery)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(page > 1 ? skip : 0);

    const [count, items] = await Promise.all([countPromise, itemsPromise]);
    const pageCount = Math.ceil(count / limit);

    if (!items) {
        return errorResponse(res, 400, "Failed to fetch donation history.");
    }

    // const getUserInfo = await Auth.findOne({ _id: auth_user });

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

const deleteDonationData = asyncHandler(async (req, res) => {
    const auth_user = req.user.id;

    const removeTransaction = await Donation.findOneAndDelete({
        _id: req.params.id,
        donar_id: auth_user,
    });

    if (removeTransaction) {

        const nearestDonation = await Donation.findOne(
            { donar_id: auth_user },
            { donation_date: 1 },
            { sort: { donation_date: -1 } } // Find the nearest donation by sorting in descending order
        );

        // Update last_donation in the Auth model with the nearest donation date
        const user = await Auth.findById(auth_user);
        user.last_donation = nearestDonation ? nearestDonation.donation_date : null;
        await user.save();

        res.status(200).json({
            status: 200,
            message: "Donation deleted successfully!",
        });
    } else {
        return errorResponse(res, 400, "Failed to delete donation!");
    }
});

module.exports = { storeNewDonationHistory, getAllDonationHistory, deleteDonationData, deleteDonationData };
