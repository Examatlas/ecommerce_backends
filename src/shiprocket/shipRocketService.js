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

// async function createShiprocketOrder(orderData) {
//     const token = await getShiprocketToken();
//     try {
//       const response = await axios.post(
//         `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
//         orderData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data.order_id; // Shiprocket order ID
//     } catch (error) {
//       console.error('Error creating order on Shiprocket:', error);
//       throw error;
//     }
//   }

async function createShiprocketOrder(orderData) {
  const token = await getShiprocketToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', orderData, { headers });
    console.log("Order created successfully:", response.data);
  } catch (error) {
    console.error("Error creating order:", error.response ? error.response.data : error.message);
  }
}


  async function generateAWB(orderId, courierId) {
    const token = await getShiprocketToken();
  
    try {
      const response = await axios.post(
        `${SHIPROCKET_BASE_URL}/courier/assign/awb`,
        { order_id: orderId, courier_id: courierId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.response.awb_code;
    } catch (error) {
      console.error('Error generating AWB:', error);
      throw error;
    }
  }



  async function schedulePickup(orderId) {
    const token = await getShiprocketToken();
  
    try {
      const response = await axios.post(
        `${SHIPROCKET_BASE_URL}/courier/generate/pickup`,
        { order_id: [orderId] }, // array of order IDs
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      throw error;
    }
  }
  

module.exports = { getShiprocketToken , createShiprocketOrder , generateAWB , schedulePickup};
