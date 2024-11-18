const shiprocketService = require("../shiprocket/shipRocketService");

// Controller to authenticate with Shiprocket and get a token
const getToken = async (req, res) => {
  try {
    const token = await shiprocketService.getShiprocketToken();
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to authenticate', error: error.message });
  }
};


// Controller to create an order in Shiprocket
const createOrder = async (req, res) => {
  const orderData = req.body; // Order data should be sent in the request body
 
  try {
    const orderId = await shiprocketService.createShiprocketOrder(orderData);
    console.log(orderId , "order id is this ")
    res.status(201).json({ success: true, orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};


// Controller to generate an AWB for a Shiprocket order
const generateAWB = async (req, res) => {
  const { orderId, courierId } = req.body; // Order ID and Courier ID should be sent in the request body
  try {
    const awbCode = await shiprocketService.generateAWB(orderId, courierId);
    res.status(200).json({ success: true, awbCode });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate AWB', error: error.message });
  }
};


// Controller to schedule a pickup for a Shiprocket order
const schedulePickup = async (req, res) => {
  const { orderId } = req.body; 
  try {
    const response = await shiprocketService.schedulePickup(orderId);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to schedule pickup', error: error.message });
  }
};

module.exports = { getToken, createOrder, generateAWB, schedulePickup };
