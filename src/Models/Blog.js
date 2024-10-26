const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required:true,
    },
    keyword: {
      type: String,
      unique: false, 
    },
    content: {
      type: String,
      // required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true
    },
    tags: [String],
  },
  { timestamps: true }
);

const BlogModel = mongoose.model("Blog", blogSchema);
module.exports = BlogModel;
