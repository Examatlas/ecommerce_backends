const express = require("express");
const { createBulkOrder } = require("../Controllers/BulkOrder");

const route = express.Router();

route.post("/createBulkOrder",createBulkOrder)

module.exports = route;