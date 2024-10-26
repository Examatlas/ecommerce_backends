const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
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
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
