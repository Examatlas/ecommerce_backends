// routes/billingRoutes.js
const express = require('express');
const { createBillingDetail, getBillingDetailByUserId,  deleteBillingDetailByBillingId, updateBillingDetailByBillingId, } = require('../Controllers/BillingDetail');
const router = express.Router();

// POST route to create billing detail
router.post('/createBillingDetail', createBillingDetail);


router.delete('/billing/deletebilling/:userId/:billingId', deleteBillingDetailByBillingId);
router.put('/billing/updatebilling/:userId/:billingId', updateBillingDetailByBillingId);


// Get Billing Detail by ID
// router.get('/getbilling/:id', getBillingDetailById);
router.get('/billing/user/:userId', getBillingDetailByUserId);

module.exports = router;
