const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  keyword: { type: String, required: true },
  price: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], required: true }, // Array of strings for tags
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
