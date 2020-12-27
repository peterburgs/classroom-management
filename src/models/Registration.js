const mongoose = require("mongoose");

// Schema
const registrationSchema = new mongoose.Schema(
  {
    patch: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    endDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    isOpening: {
      type: Boolean,
      required: true,
      default: false,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
    registrableCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistrableCourse",
      },
    ],
    teachings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teaching",
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Registration", registrationSchema);
