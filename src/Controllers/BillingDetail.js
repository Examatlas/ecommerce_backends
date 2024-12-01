// controllers/billingController.js
const BillingDetail = require('../Models/BillingDetail');

exports.createBillingDetail = async (req, res) => {
  try {
    const { 
      userId, // Add userId to the request body
      addressType='shipping',
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
      addressType,
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
    return res.status(201).json({ status: true, message: `${addressType === 'shipping' ? 'Shipping' : 'Billing'} address saved successfully`, savedBillingDetail });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


// get api
exports.getBillingDetailByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Extract the userId from the request parameters
    const { addressType = 'shipping' } = req.query; // Get the addressType from the query parameters
    
    // Prepare the query conditions for the billing details
    const where = {
      user: userId,
      $or: [
        { isActive: true },
        { isActive: { $eq: null } }, // Include documents where isActive is null
      ],
    };

    // If an addressType is provided, ensure we filter by it
    if (addressType) {
      where.addressType = addressType; // Directly filter by addressType instead of using $or
    }

    console.log("where getBiilingAddress: ", where);
    
    // Fetch the billing details based on the conditions
    const billingDetail = await BillingDetail.find(where).populate({
      path: 'user',
      select: '-password', // Exclude password from user details
    });
    
    // Check if billing details exist for the given user
    if (!billingDetail || billingDetail.length === 0) {
      return res.status(404).json({ status: false, message: 'Billing or shipping address not found' });
    }

    // Return the fetched billing details
    return res.status(200).json(billingDetail);
  } catch (error) {
    console.log("billing fetch error: ", error);
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
      return res.status(404).json({ status: false, message: 'Address not found' });
    }

    return res.status(200).json({ status: true, message: 'Details updated successfully', updatedBillingDetail });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};


// Delete a specific billing detail by userId and billingId
exports.deleteBillingDetailByBillingId = async (req, res) => {
  try {
    const { userId, billingId } = req.params; // Extract the userId and billingId from the request parameters

    // Find the specific billing detail for the user and update the billing
    const deletedBillingDetail = await BillingDetail.findOneAndUpdate(
      { user: userId, _id: billingId }, // Find by userId and billingId
      {isActive: false}, // Data to update
      { new: true, runValidators: true } // Options to return the updated document and run validation
    )
    // Check if the specific billing detail was found and deleted
    if (!deletedBillingDetail) {
      return res.status(404).json({ status: false, message: 'Address not found' });
    }

    return res.status(200).json({ status: true, message: 'Deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, message: 'Server error' });
  }
};
