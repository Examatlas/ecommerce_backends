// shiprocketService.js
const axios = require('axios');

const SHIPROCKET_BASE_URL = process.env.SHIPROCKET_BASE_URL;

async function getShiprocketToken() {
  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error('Error authenticating with Shiprocket:', error);
    throw error;
  }
}


async function createShiprocketOrder(orderData) {
  const token = await getShiprocketToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, orderData, { headers });
    console.log("Full Response Data:", response.data); 
    
    const orderId = response.data?.order_id || response.data?.orderId;
    const shipmentId = response.data?.shipment_id || response.data?.shipmentId;

    if (!orderId) {
      throw new Error("Order ID is missing in the response");
    }

    return {orderId ,shipmentId} ;
  } catch (error) {
    console.error("Error creating order:", error.response ? error.response.data : error.message);
    throw error; 
  }
}


async function generateAWB(orderId, shipmentId) {
  const token = await getShiprocketToken();
  if (!orderId || !shipmentId) {
    throw new Error("orderId and shipmentId are required.");
  }
  try {
    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/courier/assign/awb`,
      {
        order_id: orderId,
        shipment_id: shipmentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.response.awb_code;
  } catch (error) {
    if (error.response) {

      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}



async function schedulePickup(orderId) {
    const token = await getShiprocketToken();
    try {
      const response = await axios.post(
        `${SHIPROCKET_BASE_URL}/courier/generate/pickup`,
        { order_id: orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      throw error;
    }
  }
  

module.exports = { getShiprocketToken , createShiprocketOrder , generateAWB , schedulePickup};
