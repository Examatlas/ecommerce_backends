const express = require("express");
const { createAuthor } = require("../Controllers/Author");

const route = express.Router();

route.post("/createAuthor",createAuthor)

module.exports = route