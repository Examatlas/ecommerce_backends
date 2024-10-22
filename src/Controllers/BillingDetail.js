// controllers/billingController.js
const BillingDetail = require('../Models/BillingDetail');

exports.createBillingDetail = async (req, res) => {
  try {
    const { 
      userId, // Add userId to the request body
      firstName, lastName, country, streetAddress, apartment, 
      city, state, pinCode, phone, email 
    } = req.body;

    // Validate required fields
    if (!userId || !firstName || !lastName || !country || !streetAddress || !city || !state || !pinCode || !phone || !email) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Create and save billing detail
    const billingDetail = new BillingDetail({
      user: userId, // Assign the user ID
      firstName,
      lastName,
      country,
      streetAddress,
      apartment,
      city,
      state,
      pinCode,
      phone,
      email
    });

    const savedBillingDetail = await billingDetail.save();
    return res.status(201).json({ status: true, message: "User detail saved successfully", savedBillingDetail });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


// get api
exports.getBillingDetailByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Extract the userId from the request parameters

    // Find the billing detail by userId
    const billingDetail = await BillingDetail.find({ user: userId }).populate('user');
    
    // Check if the billing detail exists for the given user
    if (!billingDetail) {
      return res.status(404).json({ status: false, message: 'Billing detail not found for this user' });
    }

    return res.status(200).json(billingDetail);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


// Update specific billing detail by userId and billingId
exports.updateBillingDetailByBillingId = async (req, res) => {
  try {
    const { userId, billingId } = req.params; // Extract the userId and billingId from the request parameters
    const updateData = req.body; // Get the update data from the request body

    // Validate required fields if needed
    if (!updateData.firstName || !updateData.lastName || !updateData.country || !updateData.streetAddress || !updateData.city || !updateData.state || !updateData.pinCode || !updateData.phone || !updateData.email) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Find the specific billing detail for the user and update it
    const updatedBillingDetail = await BillingDetail.findOneAndUpdate(
      { user: userId, _id: billingId }, // Find by userId and billingId
      updateData, // Data to update
      { new: true, runValidators: true } // Options to return the updated document and run validation
    );

    // Check if the specific billing detail was found and updated
    if (!updatedBillingDetail) {
      return res.status(404).json({ status: false, message: 'Billing detail not found for this user' });
    }

    return res.status(200).json({ status: true, message: 'Billing detail updated successfully', updatedBillingDetail });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


// Delete a specific billing detail by userId and billingId
exports.deleteBillingDetailByBillingId = async (req, res) => {
  try {
    const { userId, billingId } = req.params; // Extract the userId and billingId from the request parameters

    // Find the specific billing detail for the user and delete it
    const deletedBillingDetail = await BillingDetail.findOneAndDelete({ user: userId, _id: billingId });

    // Check if the specific billing detail was found and deleted
    if (!deletedBillingDetail) {
      return res.status(404).json({ status: false, message: 'Billing detail not found for this user' });
    }

    return res.status(200).json({ status: true, message: 'Billing detail deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};
