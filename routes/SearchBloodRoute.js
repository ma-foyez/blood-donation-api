const express = require("express");
const { searchBloods } = require("../controllers/SearchBloodController");
const SearchDonar = express.Router();

SearchDonar.route('/search-donar').get(searchBloods)

module.exports = SearchDonar;