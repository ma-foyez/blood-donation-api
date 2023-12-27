const express = require("express");
const { storeDistricts } = require("../controllers/DefaultInsert");
const DistrictRoute = express.Router();

// Apply authenticateToken middleware to protect routes
DistrictRoute.route('/store').post(storeDistricts);
// DistrictRoute.route('/divisions').get(updateClient);

module.exports = DistrictRoute;