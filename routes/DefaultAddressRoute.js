const express = require("express");
const { storeDistricts, insertDefaultDivisions, storeUpzilas, storeUnions } = require("../controllers/defaultAddressMasterController");
const AddressRoute = express.Router();

AddressRoute.route('/division/store').post(insertDefaultDivisions);
AddressRoute.route('/district/store').post(storeDistricts);
AddressRoute.route('/upzila/store').post(storeUpzilas);
AddressRoute.route('/union/store').post(storeUnions);

module.exports = AddressRoute;