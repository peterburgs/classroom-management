const mongoose = require("mongoose");

// Schema
const registrableCourseSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
    course: {
      type: mongoose.Schema.Types.String,
      ref: "Course",
    },
  },
  { timestamps: true }
);

mongoose.model("RegistrableCourse", registrableCourseSchema);
