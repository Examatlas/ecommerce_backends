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
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
