const asyncHandler = require("express-async-handler");
const DivisionModel = require("../models/DivisionsModel");
const DistrictModel = require("../models/DistrictsModel");
const UnionModel = require("../models/UnionModel");
const UpzilaModel = require("../models/UpzilaModel");
const { districtData } = require("../_utils/data/districtData");
const { divisionData } = require("../_utils/data/divisionData");
const { upazilaData } = require("../_utils/data/upazilaData");
const { unionData } = require("../_utils/data/unionData");


/**
 * Store Divisions -> All Divisions List store at a times
 */
const insertDefaultDivisions = asyncHandler(async (req, res) => {

    await DivisionModel.deleteMany();

    const storeDivisions = await DivisionModel.insertMany(divisionData);

    if (storeDivisions) {
        res.status(200).json({
            status: 200,
            message: "Default divisions inserted successfully!",
            data: storeDivisions,
        });
    } else {
        res.status(400);
        throw new Error("Failed to insert default divisions.");
    }
});

/**
 * Get Division List
 */

const getAllDivisions = asyncHandler(async (req, res) => {
    // Assuming DivisionModel.find({}) returns all divisions
    const divisions = await DivisionModel.find({});

    if (divisions) {
        res.status(200).json({
            status: 200,
            message: "Divisions fetched successfully!",
            data: divisions,
        });
    } else {
        res.status(404);
        throw new Error("Divisions not found.");
    }
});


const storeDistricts = asyncHandler(async (req, res) => {
    // Delete existing records
    await DistrictModel.deleteMany();

    // Add "code" property to each district object
    const districtsWithCode = districtData.map(district => {
        const district_code = district.name.toLowerCase().replace(/\s/g, ''); // Generate code from name
        return { ...district, district_code };
    });

    // Insert districts with the new "code" property into the database
    const addDistrictList = await DistrictModel.insertMany(districtsWithCode);

    if (addDistrictList) {
        res.status(200).json({
            status: 200,
            message: "Districts list inserted successfully!",
            data: addDistrictList,
        });
    } else {
        res.status(400);
        throw new Error("Failed to insert Districts list.");
    }
});

/**
 * Get Division List
 */

const getAllDistricts = asyncHandler(async (req, res) => {
    // Assuming DivisionModel.find({}) returns all divisions
    const districts = await DistrictModel.find({});

    if (districts) {
        res.status(200).json({
            status: 200,
            message: "Districts fetched successfully!",
            data: districts,
        });
    } else {
        res.status(404);
        throw new Error("Districts not found.");
    }
});

/**
 * Get Districts By Division ID
 */
const getDistrictsByDivision = asyncHandler(async (req, res) => {

    const districtByDivision = await DistrictModel.find({ parent_id: req.params.id });

    if (districtByDivision) {
        res.status(201).json({
            data: districtByDivision,
            message: "Districts fetched successfully!",
        });
    } else {
        res.status(400);
        throw new Error("Districts fetched failed!",);
    }
});


const storeUpzilas = asyncHandler(async (req, res) => {

    await UpzilaModel.deleteMany();

    const addUpzilas = await UpzilaModel.insertMany(upazilaData);

    if (addUpzilas) {
        res.status(200).json({
            status: 200,
            message: "Upzila list inserted successfully!",
            data: addUpzilas,
        });
    } else {
        res.status(400);
        throw new Error("Failed to insert upzila list.");
    }
});


/**
 * Get Upzilas List
 */

const getAllUpzilas = asyncHandler(async (req, res) => {
    // Assuming DivisionModel.find({}) returns all divisions
    const upzilas = await UpzilaModel.find({});

    if (upzilas) {
        res.status(200).json({
            status: 200,
            message: "Upzilas fetched successfully!",
            data: upzilas,
        });
    } else {
        res.status(404);
        throw new Error("Upzilas not found.");
    }
});

/**
 * Get Upzila By District ID
 */
const getUpzilasByDistrict = asyncHandler(async (req, res) => {

    const districtByDivision = await UpzilaModel.find({ parent_id: req.params.id });

    if (districtByDivision) {
        res.status(201).json({
            data: districtByDivision,
            message: "Upzilas fetched successfully!",
        });
    } else {
        res.status(400);
        throw new Error("Upzilas fetched failed!",);
    }
});

const storeUnions = asyncHandler(async (req, res) => {

    await UnionModel.deleteMany();

    const addUnions = await UnionModel.insertMany(unionData);

    if (addUnions) {
        res.status(200).json({
            status: 200,
            message: "Union list inserted successfully!",
            data: addUnions,
        });
    } else {
        res.status(400);
        throw new Error("Failed to insert union list.");
    }
});


/**
 * Get Unions List
 */

const getAllUnions = asyncHandler(async (req, res) => {

    const unions = await UnionModel.find({});

    if (unions) {
        res.status(200).json({
            status: 200,
            message: "Unions fetched successfully!",
            data: unions,
        });
    } else {
        res.status(404);
        throw new Error("Unions not found.");
    }
});

/**
 * Get Unions By Upzila ID
 */
const getUnionsByUpzila = asyncHandler(async (req, res) => {

    const unionsByUpzila = await UnionModel.find({ parent_id: req.params.id });

    if (unionsByUpzila) {
        res.status(201).json({
            data: unionsByUpzila,
            message: "Unions fetched successfully!",
        });
    } else {
        res.status(400);
        throw new Error("Unions fetched failed!",);
    }
});

module.exports = { insertDefaultDivisions, storeDistricts, storeUpzilas, storeUnions, getAllDivisions, getAllDistricts, getDistrictsByDivision, getAllUpzilas, getUpzilasByDistrict, getAllUnions, getUnionsByUpzila }