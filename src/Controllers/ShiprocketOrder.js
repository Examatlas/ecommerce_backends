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



const createOrder = async (req, res) => {
  const orderData = req.body; 
  try {
    const orderId = await shiprocketService.createShiprocketOrder(orderData);
    console.log(orderId, "Order ID is this"); // Log the order ID
    res.status(201).json({ success: true, orderId });
  } catch (error) {
    console.error("Error in createOrder handler:", error.message);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};


const generateAWBS = async (req, res) => {
  const { order_id, shipment_id } = req.body;

  if (!order_id || !shipment_id) {
    return res.status(400).json({ success: false, message: "orderId and shipmentId are required." });
  }

  try {
    const awbResponse = await shiprocketService.generateAWB(order_id, shipment_id);

    if (awbResponse && awbResponse.awb_code) {
      return res.status(200).json({ success: true, awbCode: awbResponse.awb_code });
    } else {
      throw new Error('AWB code not found in the response.');
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to generate AWB", error: error.message });
  }
};


const schedulePickup = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "Order ID is required" });
  }

  try {
    const response = await shiprocketService.schedulePickup(orderId);

    if (response && response.success) {
      res.status(200).json({ success: true, message: "Pickup scheduled successfully", response });
    } else {
      throw new Error(response.message || "Failed to schedule pickup");
    }
  } catch (error) {
    console.error("Error scheduling pickup:", error.message);
    res.status(500).json({ success: false, message: "Failed to schedule pickup", error: error.message });
  }
};

module.exports = { getToken, createOrder, generateAWBS, schedulePickup };
