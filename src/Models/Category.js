const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
    categoryName:{
        type : String,
        trim : true,
        required: true,
        unique: true
    },
    description:{
        type:String,
        trim:true
    },
    tags:{
        type : [String],
        
    },
    // images: [
    //   {
    //     url: { type: String, required: true, trim: true },  
    //     filename: { type: String, required: true, trim: true },  // Image filename
    //     contentType: { type: String,trim: true },  // Optional: Content type (e.g., 'image/jpeg')
    //     size: { type: Number },  // Optional: File size in bytes
    //     uploadDate: { type: Date, default: Date.now }  // Optional: Upload timestamp
    //   }
    // ],
    
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
      },
      deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
      },
      deletedAt: {
        type: Date,
        required: false,
        default: null
      },
      is_active: {
        type: Boolean,
        required: true,
        default: true
      },

},{timestamps:true}
)
const Category = mongoose.model("Category",CategorySchema)
module.exports = Category;
