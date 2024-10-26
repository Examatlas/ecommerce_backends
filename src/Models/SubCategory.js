const mongoose = require("mongoose");
const SubCategorySchema = new mongoose.Schema({
    categoryId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      trim:true,
      required: true
    },
    subCategoryName:{
        type:String,
        trim: true,
        required: true
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
const SubCategory = mongoose.model("SubCategory",SubCategorySchema)
module.exports = SubCategory;
