const asyncHandler = require("express-async-handler");
const Auth = require("../models/AuthModal");
const Donation = require("../models/DonationModel");

/**
 * Store New Donation History
 */

const storeNewDonationHistory = asyncHandler(async (req, res) => {
    const { donation_date, donation_place } = req.body;
    const auth_user = req.user.id;

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
    const lastDonation = await Donation.findOne(
        { donar_id: auth_user },
        { donation_date: 1 },
        { sort: { donation_date: -1 } }
    );

    if (lastDonation) {
        // Ensure both donation_date and lastDonation.donation_date are Date objects
        const currentDonationDate = new Date(donation_date);
        const lastDonationDate = new Date(lastDonation.donation_date);

        // Calculate the difference in days between the last donation and the current request
        const millisecondsInADay = 24 * 60 * 60 * 1000;
        const daysSinceLastDonation = Math.floor(
            (currentDonationDate.getTime() - lastDonationDate.getTime()) / millisecondsInADay
        );

        if (daysSinceLastDonation < 90) {
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

    // Update the last_donation property in Auth model
    getUserInfo.last_donation = donation_date;
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

    const donationQuery = { user: auth_user }; 

    if (status && status.trim() !== '') {
        donationQuery.status = status;
    }

    countPromise = Donation.countDocuments(donationQuery);
    itemsPromise = Donation.find(donationQuery).limit(limit).skip(page > 1 ? skip : 0);

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
 * Get Single Transaction
//  */
// const getSingleTransaction = asyncHandler(async (req, res) => {

//     const singleProfile = await Transaction.findById(req.params.id);

//     if (singleProfile) {
//         res.status(200).json({
//             data: singleProfile,
//             status: 200,
//             message: "Transaction loaded successfully!"
//         });
//     } else {
//         res.status(400);
//         throw new Error("Failed to load transaction!");
//     }
// });

/**
 * Update Transaction
//  */
// const updateTransaction = asyncHandler(async (req, res) => {

//     const { _id, client_id, client_name, date_of_transaction, type_of_transaction, amount } = req.body;
//     const auth_user = req.user.id;

//     if (!_id || !client_id || !client_name || !date_of_transaction || !type_of_transaction || !amount) {
//         res.status(400);
//         throw new Error("Please provide all required fields");
//     }

//     const getTotalTransaction = await transactionCalculationForPeople(client_id, amount, type_of_transaction);

//     // Get Profiles Details From Profile Collection(PeopleRoute) by _id
//     const getClientByID = await Profile.findOne({ _id: client_id });

//     if (!getClientByID) {
//         res.status(400);
//         throw new Error("Invalid User!");
//     }

//     // update Previous Profile by id [update : total_liabilities, total_payable, due_liabilities, due_payable]
//     const updateTransaction = await Profile.updateOne({ _id: client_id, auth_user: auth_user }, {
//         $set: {
//             total_liabilities: getTotalTransaction.TotalLiabilities,
//             total_payable: getTotalTransaction.totalPayable,
//             due_liabilities: getTotalTransaction.dueLiabilities,
//             due_payable: getTotalTransaction.duePayable,
//         }
//     });

//     if (!updateTransaction) {
//         res.status(400);
//         throw new Error("Something went wrong! Transaction update failed!");
//     }

//     const updateOne = await Transaction.updateOne({ _id, auth_user: auth_user }, {
//         $set: {
//             _id: _id,
//             client_id: client_id,
//             client_name: client_name,
//             mobile: mobile,
//             email: email,
//             relation: relation,
//             date_of_transaction: date_of_transaction,
//             type_of_transaction: type_of_transaction,
//             amount: amount,
//         }
//     });

//     if (updateOne) {
//         res.status(200).json({
//             data: {
//                 _id: _id,
//                 client_id: client_id,
//                 client_name: client_name,
//                 mobile: mobile,
//                 email: email,
//                 relation: relation,
//                 date_of_transaction: date_of_transaction,
//                 type_of_transaction: type_of_transaction,
//                 amount: amount,
//             },
//             status: 200,
//             message: "Transaction updated successfully!"
//         });
//     } else {
//         res.status(400);
//         throw new Error("Failed to transaction!");
//     }
// });


/**
 * Delete Single Transaction
//  */
// const deleteTransaction = asyncHandler(async (req, res) => {
//     const auth_user = req.user.id;
//     // const removeTransaction = await Profile.findByIdAndDelete(req.params.id);
//     const removeTransaction = await Profile.findOneAndDelete({
//         _id: req.params.id,
//         auth_user: auth_user
//     });

//     if (removeTransaction) {
//         res.status(200).json({
//             status: 200,
//             message: "Transaction deleted successfully!"
//         });
//     } else {
//         res.status(400);
//         throw new Error("Failed to delete transaction!");
//     }
// });

module.exports = { storeNewDonationHistory, getAllDonationHistory }