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
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
  },
  { timestamps: true }
);

mongoose.model("Registration", registrationSchema);
