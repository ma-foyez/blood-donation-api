const express = require("express");
const { storeDistricts, insertDefaultDivisions, storeUpzilas, storeUnions, getAllDivisions, getAllDistricts, getDistrictsByDivision, getAllUpzilas, getUpzilasByDistrict, getAllUnions, getUnionsByUpzila } = require("../controllers/DefaultAddressMasterController");
const AddressRoute = express.Router();

/**
 * Divisions
 */
AddressRoute.route('/division/store').post(insertDefaultDivisions);
AddressRoute.route('/division').get(getAllDivisions);

/**
 * Districts
 */
AddressRoute.route('/district/store').post(storeDistricts);
AddressRoute.route('/district').get(getAllDistricts);
AddressRoute.route('/district/:id').get(getDistrictsByDivision);

/**
 * Upzilas
 */
AddressRoute.route('/upzila/store').post(storeUpzilas);
AddressRoute.route('/upzila').get(getAllUpzilas);
AddressRoute.route('/upzila/:id').get(getUpzilasByDistrict);

/**
 * Unions
 */
AddressRoute.route('/union/store').post(storeUnions);
AddressRoute.route('/union').get(getAllUnions);
AddressRoute.route('/union/:id').get(getUnionsByUpzila);

module.exports = AddressRoute;