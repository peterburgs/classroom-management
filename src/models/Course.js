const mongoose = require("mongoose");

// Schema
const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    numberOfCredits: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Course", courseSchema);
