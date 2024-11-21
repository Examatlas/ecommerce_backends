const mongoose = require("mongoose")

const BulkOrderSchema = new mongoose.Schema({
    storeName:{
        type:String,
        required:true
    },
    personName:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('BulkOrder',BulkOrderSchema);
