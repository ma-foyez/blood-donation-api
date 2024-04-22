const express = require("express");
const { storeDistricts, insertDefaultDivisions, storeUnions, getAllDivisions, getAllDistricts, getDistrictsByDivision, getAllUnions, getUnionsByUpzila, storeAreas, getAllAreas, getAreaByDistrict } = require("../controllers/DefaultAddressMasterController");
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
 * Areas
 */
AddressRoute.route('/area/store').post(storeAreas);
AddressRoute.route('/area').get(getAllAreas);
AddressRoute.route('/area/:id').get(getAreaByDistrict);

/**
 * Unions
 */
// AddressRoute.route('/union/store').post(storeUnions);
// AddressRoute.route('/union').get(getAllUnions);
// AddressRoute.route('/union/:id').get(getUnionsByUpzila);

module.exports = AddressRoute;