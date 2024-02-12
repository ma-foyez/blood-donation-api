const express = require("express");
const DonationRoute = express.Router();
const { authenticateToken } = require("../config/generateToken");
const { storeNewDonationHistory, getAllDonationHistory, deleteDonationData } = require("../controllers/DonationController");

// DonationRoute.route('/store-transaction').post(authenticateToken, storeNewDonationHistory)
DonationRoute.route('/store-donation').post(authenticateToken, storeNewDonationHistory)
DonationRoute.route('/donation-list').get(authenticateToken, getAllDonationHistory)
DonationRoute.route('/delete-donation/:id').delete(authenticateToken, deleteDonationData)

module.exports = DonationRoute;

