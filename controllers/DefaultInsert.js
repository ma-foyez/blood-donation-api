const asyncHandler = require("express-async-handler");
const Divisions = require("../models/DivisionsModel");
const { divisionData } = require("../routes/datas/divisions");


const insertDefaultDivisions = asyncHandler(async (req, res) => {
   
    await Divisions.deleteMany();

    const storeDivisions = await Divisions.insertMany(divisionData);

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


module.exports = { insertDefaultDivisions }