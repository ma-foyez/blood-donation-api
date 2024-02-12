const express = require("express");
const DonationRoute = express.Router();
const { authenticateToken } = require("../config/generateToken");
const { storeNewDonationHistory, getAllDonationHistory } = require("../controllers/DonationController");

// DonationRoute.route('/store-transaction').post(authenticateToken, storeNewDonationHistory)
DonationRoute.route('/store-donation').post(authenticateToken, storeNewDonationHistory)
DonationRoute.route('/donation-list').get(authenticateToken, getAllDonationHistory)

module.exports = DonationRoute;

