const razorpayInstance = require("../../razorpayInstance"); // Adjust the path as needed
const crypto = require("crypto");
const Order = require("../Models/Order")
const BillingDetail = require("../Models/BillingDetail");
const Cart = require("../Models/Cart");
const User = require("../Models/User");
const Payment = require("../Models/Payment");
const Shipping = require("../Models/Shipping");
const shipRocketService = require("../shiprocket/shipRocketService")



exports.checkout = async (req, res) => {
  try {
    const { totalAmount, shippingCharges, taxAmount, discounts, finalAmount, paymentMethod, cartItems , userId , shippingDetailId, isShippingBillingSame=true, billingDetailId, razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    const userDetails = await User.findById(userId);
    const shippingAddress = await BillingDetail.findById(shippingDetailId).populate({
      path: 'user',
      select: '-password', // Exclude password from user details
    });
    let billingAddress;
    if(isShippingBillingSame === false) {
      if(billingDetailId)
    billingAddress = await BillingDetail.findById(billingDetailId).populate({
      path: 'user',
      select: '-password', // Exclude password from user details
    });
    }
    const options = {
      amount: Number(req?.body?.finalAmount * 100), // amount in smallest unit
      // amount: 5000, // amount in smallest unit
      currency: "INR",
      receipt: `order_${new Date().getTime()}`,  // Custom order ID using timestamp
    };
    console.log("razorpay_order_id, razorpay_payment_id, razorpay_signature at checkout: ", razorpay_payment_id, razorpay_signature)
    const order = await razorpayInstance.orders.create(options);
    const create_order = await Order.create({
      userId: userId,
      razorpayOrderId: order.id,
      razorpayReceipt: order?.receipt,
      shippingDetailId,
      isShippingBillingSame,
      billingDetailId,
      totalAmount,
      shippingCharges,
      taxAmount,
      discounts,
      finalAmount: finalAmount,
      paymentMethod,
      items: cartItems,
    });
    const createPayment = await Payment.create({
      orderId: create_order._id,
      razorpayOrderId: order.id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      currency: order.currency,
      finalAmount: finalAmount,
      method: order?.method,
      status: "Initiated",
    });
    order.orderDetails = create_order
    res.status(200).json({
      success: true,
      order,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.mobile
      },
      notes: {
        customerInfo: userDetails, // Additional optional data (e.g., user info, order details)
         shippingAddress: shippingAddress, 
         isShippingBillingSame: isShippingBillingSame, 
         billingAddress: billingAddress ,
        payload: {userId, shippingDetailId,isShippingBillingSame, billingDetailId, totalAmount, razorpay_payment_id, razorpay_signature},
        cartItems: cartItems, //
      },
      payment: createPayment
    });
    // console.log(order, "order is this ")
  }
  catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};




// exports.paymentVerification = async (req, res) => {

//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isApp=false } = req.body;

//   console.log("Request Body:", req.body);

//   const body = razorpay_order_id + "|" + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;
//   console

//   if (isAuthentic) {
//     try {
      
//        const updateOrder = await Order.findOneAndUpdate(
//         {
//           razorpay_order_id : razorpay_order_id
//         },
//         {
//           status : "Paid",razorpay_payment_id,razorpay_signature
//         },
//         {
//           new : true
//         }
//        )
//        console.log("Payment saved successfully:", updateOrder);
//       // Redirecting to success page
//       if(updateOrder){
//         isApp ? 
//         res.status(200).json({
//           success: true,
//           message: "Payment verification completed",
//           data: updateOrder,
//         })
//         : 
//       res.redirect(
//         `${process.env.ECOMMERCE_FE_URL || 'http://localhost:5173'}/paymentsuccess?reference=${updateOrder._id}&userId=${updateOrder.userId}`
//       );
//     }else{

//     }

//     } catch (error) {
//       console.error("Error saving payment:", error);
//       const updateOrder = await Order.findOneAndUpdate(
//         {
//           razorpay_order_id : razorpay_order_id
//         },
//         {
//           status : "Failed"
//         },
//        )
//       res.status(500).json({
//         success: false,
//         message: "Payment verification failed",
//         error: error.message,
//       });
//     }
//   } else {
//     const updateOrder = await Order.findOneAndUpdate(
//       {
//         razorpay_order_id : razorpay_order_id
//       },
//       {
//         status : "Failed"
//       },
//      )
//     console.log("Invalid signature:", { expectedSignature, razorpay_signature });
//     res.status(400).json({
//       success: false,
//       message: "Invalid signature",
//     });
//   }
// };




exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isApp = false } = req.body;

  console.log("Request Body:", req.body);

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      // Update the order status to 'Paid'
      const updateOrder = await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          status: "Paid",
        },
        {
          new: true,
        }
      );

      const updatePayment = await Payment.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAt: new Date()
        },
        {
          new: true,
        }
      );

      console.log("Payment saved successfully:", updateOrder);

      // If the order is successfully updated, delete the cart
      if (updateOrder) {
        await Cart.deleteOne({ userId: updateOrder.userId });
        console.log("Cart deleted successfully for user:", updateOrder.userId);

        // creating a new order in shiprocket
        const shippingAddress = await BillingDetail.findById(updateOrder.shippingDetailId);
        let billingAddress;
        if(updateOrder.isShippingBillingSame === false && updateOrder.shippingDetailId != updateOrder.billingDetailId){
        billingAddress = await BillingDetail.findById(updateOrder.billingDetailId);
      }else{
        billingAddress = shippingAddress;
      }
        const orderData = {
          "order_id": updateOrder.orderId,
          "order_date": updateOrder.createdAt,
          "pickup_location": "Primary",
          "channel_id": "5793038",
          "comment": "Crown publication order recieved prepaid order",
          "billing_customer_name": shippingAddress?.firstName + " " + shippingAddress?.lastName,
          "billing_last_name": billingAddress?.lastName,
          "billing_address":  billingAddress?.streetAddress,
          "billing_address_2": billingAddress?.apartment,
          "billing_city": billingAddress?.city,
          "billing_pincode": billingAddress?.pinCode,
          "billing_state": billingAddress?.state,
          "billing_country": billingAddress?.country,
          "billing_email": billingAddress?.email,
          "billing_phone": billingAddress?.phone,
          "shipping_is_billing": updateOrder?.isShippingBillingSame,
          "shipping_customer_name": shippingAddress?.firstName,
          "shipping_last_name": shippingAddress?.lastName,
          "shipping_address": shippingAddress?.streetAddress,
          "shipping_address_2": shippingAddress?.apartment,
          "shipping_city": shippingAddress?.city,
          "shipping_pincode": shippingAddress?.pinCode,
          "shipping_country": shippingAddress?.country,
          "shipping_state": shippingAddress?.state,
          "shipping_email": shippingAddress?.email,
          "shipping_phone": shippingAddress?.phone,
          "order_items": updateOrder?.items.map(item => ({
            name: item.bookId.title, // Book title
            sku: item.bookId.isbn, // ISBN used as SKU
            units: item.quantity.toString(), // Quantity as string
            // selling_price: item.bookId.sellPrice.toString(), // Selling price as string
            selling_price: item.bookId.price.toString(),
            discount: (item.bookId.price - item.bookId.sellPrice).toString(), // Calculated discount as string
            tax: "0", // Tax (if applicable)
            hsn: "4901" // HSN code for books
          })),
          "payment_method": "Prepaid",
          "shipping_charges": updateOrder?.shippingCharges.toString(),
          "giftwrap_charges": "",
          "transaction_charges": "",
          "total_discount": "",
          "sub_total": updateOrder?.totalAmount.toString(),
          "length": "10",
          "breadth": "10",
          "height": "10",
          "weight": "1.5"
        };

        console.log("Creating Shiprocket order:", orderData);

        try{

       const createShiprocketOrder = await shipRocketService.createShiprocketOrder(orderData);
       console.log("Shiprocket order created:", createShiprocketOrder)
       const geSpecificOrder = await shipRocketService.getSpecificOrder(createShiprocketOrder?.order_id)
       const createShippingPayload = {

       }
       const createShipping = await Shipping.create(createShippingPayload);
      }catch(err){
        console.log("error creating shipping: ", err)
      }

        if (isApp) {
          res.status(200).json({
            success: true,
            message: "Payment verification completed and cart deleted",
            data: updateOrder,
          });
        } else {
          res.redirect(
            `${process.env.ECOMMERCE_FE_URL || "http://localhost:5173"}/paymentsuccess?reference=${updateOrder._id}&userId=${updateOrder.userId}&paymentId=${updatePayment._id}`
          );
        }
      } else {
        res.status(500).json({
          success: false,
          message: "Order update failed",
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);

      // Update order status to 'Failed' in case of an error
      await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          status: "Failed",
        }
      );
      await Payment.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
        },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          failedAt: new Date(),
          failureReason: "Failed",
          status: "Failed",
        }
      );

      res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error: error.message,
      });
    }
  } else {
    // Invalid signature case
    await Order.findOneAndUpdate(
      {
        razorpay_order_id: razorpay_order_id,
      },
      {
        status: "Failed",
      }
    );

    console.log("Invalid signature:", { expectedSignature, razorpay_signature });

    res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  }
};




// get all order api 
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database, sorted by _id in descending order
    const orders = await Order.find().sort({ _id: -1 });

    // Filter out orders with valid items (i.e., with non-null bookId)
    const filteredOrders = orders.filter(order =>
      order.items && order.items.some(item => item.bookId !== null)
    );

    // Fetch billing details for each order using their billingDetailId
    const ordersWithBillingDetails = await Promise.all(
      filteredOrders.map(async (order) => {
        const shippingAddress = await BillingDetail.findById(order.shippingDetailId);
        let billingAddress;
        if(order.isShippingBillingSame === false && order.shippingDetailId != order.billingDetailId){
        billingAddress = await BillingDetail.findById(order.billingDetailId);
      }
        return {
          _id: order._id,
          orderId: order?.orderId,
          userId: order.userId,
          totalAmount: order?.totalAmount,
          shippingCharges: order?.shippingCharges,
          taxAmount: order?.taxAmount,
          discounts: order?.discounts,
          finalAmount: order?.finalAmount,
          paymentMethod: order?.paymentMethod,
          status: order.status,
          shippingAddress: shippingAddress || null, // Include billing detail (or null if not found)
          isShippingBillingSame: order.isShippingBillingSame,
          billingAddress: billingAddress || null, // Include billing detail (or null if not found)
          items: order.items.filter(item => item.bookId !== null), // Filter items with valid bookId
          razorpayOrderId: order?.razorpayOrderId,
          createdAt: order?.createdAt
        };
      })
    );

    // Respond with the list of orders along with billing details
    res.status(200).json({
      success: true,
      orders: ordersWithBillingDetails,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};


// get order by id
exports.getOrderDetails = async (req, res) => {
  try {
    // Extract the order ID from the request parameters
    const { orderId } = req.params;

    // Find the order by ID
    const order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Respond with the order details
    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId,
        userId: order.userId,
        totalAmount: order?.totalAmount,
        shippingCharges: order?.shippingCharges,
        taxAmount: order?.taxAmount,
        discounts: order?.discounts,
        finalAmount: order?.finalAmount,
        paymentMethod: order?.paymentMethod,
        status: order.status,
        billingDetailId: order.billingDetailId,
        items: order.items,
        razorpayOrderId: order.razorpayOrderId,
        createdAt: order.createdAt
      },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
};



// get one order by user id 
exports.getOneOrderByUserId = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;

    console.log("Received userId:", userId);

    // Fetch the latest order matching the userId, sorted by _id in descending order
    const order = await Order.findOne({ userId }).sort({ _id: -1 });

    console.log("Fetched order:", order);

    // If no order is found, respond accordingly
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    // Fetch the billing details based on the billingDetailId
    const shippingAddress = await BillingDetail.findById(order.shippingDetailId);
    let billingAddress;
    if(order.isShippingBillingSame === false && order.shippingDetailId != order.billingDetailId){
    billingAddress = await BillingDetail.findById(order.billingDetailId);
  }

    console.log("Fetched billing detail:", shippingAddress);

    // Respond with the order along with its billing details
    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        orderId: order.orderId,
        userId: order.userId,
        totalAmount: order?.totalAmount,
        shippingCharges: order?.shippingCharges,
        taxAmount: order?.taxAmount,
        discounts: order?.discounts,
        finalAmount: order?.finalAmount,
        paymentMethod: order?.paymentMethod,
        status: order.status,
        shippingDetailId: order.shippingDetailId,
        shippingAddress: shippingAddress,
        isShippingBillingSame: order.isShippingBillingSame,
        billingDetailId: order.billingDetailId,
        billingAddress: billingAddress, // Include billing detail (or null if not found)
        items: order.items.filter(item => item.bookId !== null), // Filter items with non-null bookId
        razorpayOrderId: order.razorpayOrderId,
        createdAt: order.createdAt
      },
    });
  } catch (error) {
    console.error("Error fetching order by userId:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};



// Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;

    console.log("Received userId:", userId);

    // Fetch orders by userId and sort them by creation in descending order
    const orders = await Order.find({ userId, isActive: true }).populate('shipping')
    .sort({ _id: -1 });

    console.log("Fetched orders:", orders);

    // Filter orders where items have valid bookIds
    const filteredOrders = orders.filter(order =>
      order.items && order.items.some(item => item.bookId !== null)
    );

    // Fetch billing details for each order and attach them to the response
    const ordersWithBillingDetails = await Promise.all(
      filteredOrders.map(async (order) => {
        console.log("order item:", JSON.stringify(order));
        const shippingAddress = await BillingDetail.findById(order.shippingDetailId);
        let billingAddress;
        if(order.isShippingBillingSame === false && order.shippingDetailId != order.billingDetailId){
        billingAddress = await BillingDetail.findById(order.billingDetailId);
      }

        return {
          _id: order._id,
          userId: order.userId,
          orderId: order.orderId,
          totalAmount: order?.totalAmount,
          shippingCharges: order?.shippingCharges,
          taxAmount: order?.taxAmount,
          discounts: order?.discounts,
          finalAmount: order?.finalAmount,
          paymentMethod: order?.paymentMethod,
          status: order.status,
          shippingDetailId: order.shippingDetailId,
          shippingAddress: shippingAddress,
          isShippingBillingSame: order.isShippingBillingSame,
          billingDetailId: order.billingDetailId,
          billingAddress: billingAddress, // Include billing detail (or null if not found)
          items: order.items.filter(item => item.bookId !== null), // Filter items with valid bookId
          razorpayOrderId: order.razorpayOrderId,
          createdAt: order.createdAt
        };
      })
    );

    // Send the final response with the orders and billing details
    res.status(200).json({
      success: true,
      orders: ordersWithBillingDetails,
    });
  } catch (error) {
    console.error("Error fetching orders by userId:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

