const mongoose = require("mongoose");

// Schema
const courseSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    numberOfCredits: {
      type: Number,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Course", courseSchema);
