const asyncHandler = require("express-async-handler");
const DivisionModel = require("../models/DivisionsModel");
const DistrictModel = require("../models/DistrictsModel");
const { districtData } = require("../_utils/data/districtData");
const { divisionData } = require("../_utils/data/divisionData");
const UpzilaModel = require("../models/UpzilaModel");
const { upazilaData } = require("../_utils/data/upazilaData");
const UnionModel = require("../models/UnionModel");
const { unionData } = require("../_utils/data/unionData");

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


module.exports = { insertDefaultDivisions, storeDistricts, storeUpzilas, storeUnions }