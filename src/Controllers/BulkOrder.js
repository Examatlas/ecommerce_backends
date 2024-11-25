const BulkOrder = require("../Models/BulkOrder");
const {mailPayload} = require("../Utilis/Email/BulkOrderPayload");

exports.createBulkOrder = async(req,res)=>{
    try{
        const {storeName , personName , location , city , state , contactNumber , email ,message } = req.body;

        if (!storeName || !personName || !location || !city || !state || !contactNumber || !email || !message) {
            return res.status(400).json({ status: false, message: "All fields are required" });
          }

        const bulkOrder = await BulkOrder.create({
            storeName,
            personName,
            location,
            city,
            state,
            contactNumber,
            email,
            message
        })

        await mailPayload("Bulk_Order_Request", {
            email,
            cc: ["amitaryacp@gmail.com"],
            storeName,
            personName,
            location,
            city,
            state,
            contactNumber,
            message
          });
          
        return res.status(201).json({status:true , message:"bulk order created successfully " , data:bulkOrder})
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({status:false,message:"internal server error"})
    }
}


