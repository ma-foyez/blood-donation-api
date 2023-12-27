const asyncHandler = require("express-async-handler");
const DivisionModel = require("../models/DivisionsModel");
const DistrictModel = require("../models/DistrictsModel");
const { districtData } = require("../_utils/data/districtData");
const { divisionData } = require("../_utils/data/divisionData");

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


module.exports = { insertDefaultDivisions, storeDistricts }