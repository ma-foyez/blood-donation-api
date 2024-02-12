const Division = require("../../models/DivisionsModel");
const District = require("../../models/DistrictsModel");
const Upzila = require("../../models/UpzilaModel");
const Union = require("../../models/UnionModel");

const getDivisionByID = async (id) => {
    const singleDivision = await Division.findOne({ id });
    return singleDivision;
}

const getDistrictByID = async (id) => {
    const singleDistrict = await District.findOne({ id});
    return singleDistrict;
}

const getUpzilaByID = async (id) => {
    const singleUpzila = await Upzila.findOne({ id });
    return singleUpzila;
}

const getUnionByID = async (id) => {
    const singleUnion = await Union.findOne({ id });
    return singleUnion;
}


module.exports = { getDivisionByID, getDistrictByID, getUpzilaByID, getUnionByID }