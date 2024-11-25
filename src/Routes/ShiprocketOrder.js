const express = require('express');
const router = express.Router();
const ShiprocketOrder = require("../Controllers/ShiprocketOrder");

// Routes
router.post('/token', ShiprocketOrder.getToken);
router.post('/order', ShiprocketOrder.createOrder);
router.post('/awb', ShiprocketOrder.generateAWBS);
router.post('/pickup', ShiprocketOrder.schedulePickup);

module.exports = router;
