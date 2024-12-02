const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  keyword: { type: String, required: true },
  price: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  subject: { type: String, required: true },
  // examName: { type: String, required: true },
  dimension: { type: JSON, required: true },
  // width: { type: String, required: true },
  edition:{type:String,required:true},
  publication:{type:String,required:true},
  stock:{type:String , required : true},
  page:{type:Number , required : true},
  weight: { type: String, required: true },
  isbn: { type: String, required: true },
  tags: { type: [String], required: true },
  IsInCart : {type : Boolean , default : false},
 
  images: [
    {
      url: { type: String, required: true, trim: true },  // URL or path to the image
      filename: { type: String, required: true, trim: true },  // Image filename
      contentType: { type: String,trim: true },  // Optional: Content type (e.g., 'image/jpeg')
      size: { type: Number },  // Optional: File size in bytes
      uploadDate: { type: Date, default: Date.now }  // Optional: Upload timestamp
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
