const express = require("express");
const { checkout, paymentVerification, getAllOrders, getOrderDetails, getOrdersByUserId, getOneOrderByUserId } = require("../Controllers/PaymentController"); // Adjust the path to your controller

const router = express.Router();

// Route for creating the order (checkout)
router.post("/checkout", checkout);
router.get("/orders", getAllOrders);
router.get("/order/:orderId", getOrderDetails);
// Route for payment verification
router.post("/paymentverification", paymentVerification);

router.get("/getOrdersByUserId/:userId", getOrdersByUserId);
router.get("/getOneOrderByUserId/:userId", getOneOrderByUserId);

module.exports = router;
