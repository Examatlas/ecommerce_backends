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
    images: [
      {
        url: { type: String, required: true, trim: true },  // URL or path to the image
        filename: { type: String, required: true, trim: true },  // Image filename
        contentType: { type: String,trim: true },  // Optional: Content type (e.g., 'image/jpeg')
        size: { type: Number },  // Optional: File size in bytes
        uploadDate: { type: Date, default: Date.now }  // Optional: Upload timestamp
      }
    ],
    tags: [String],
  },
  
  { timestamps: true }
);

const BlogModel = mongoose.model("Blog", blogSchema);
module.exports = BlogModel;
