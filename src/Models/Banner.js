// models/Banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    images: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
        contentType: { type: String, required: true },
        size: { type: Number, required: true },
        uploadDate: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
