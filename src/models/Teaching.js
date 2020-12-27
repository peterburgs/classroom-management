const mongoose = require("mongoose");

// Schema
const teachingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    course: {
      type: String,
      ref: "Course",
      required: true,
    },
    group: {
      type: Number,
      required: true,
      default: 1,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      default: 0,
    },
    startPeriod: {
      type: Number,
      required: true,
      default: 1,
    },
    endPeriod: {
      type: Number,
      required: true,
      default: 2,
    },
    numberOfStudents: {
      type: Number,
      required: true,
      default: 1,
    },
    theoryRoom: {
      type: String,
      required: true,
      default: "",
    },
    numberOfPracticalWeeks: {
      type: Number,
      required: true,
      default: 7,
    },
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    isRemoved: {
      type: Boolean,
      required: true,
    },
    labUsages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "LabUsage",
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Teaching", teachingSchema);
