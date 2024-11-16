// models/Exam.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true,
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
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
