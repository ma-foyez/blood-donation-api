const express = require("express");
const { insertDefaultDivisions } = require("../controllers/DefaultInsert");
// const { createClient, getClientList, getClientDetails, updateClient, deleteClient } = require("../controllers/clientController");
const DivisionRoute = express.Router();

// Apply authenticateToken middleware to protect routes
DivisionRoute.route('/store').post(insertDefaultDivisions);
// DivisionRoute.route('/divisions').get(updateClient);

module.exports = DivisionRoute;