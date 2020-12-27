const mongoose = require("mongoose");

// Schema
const labUsageSchema = new mongoose.Schema(
  {
    lab: {
      type: mongoose.Types.ObjectId,
      ref: "Lab",
    },
    teaching: {
      type: mongoose.Types.ObjectId,
      ref: "Teaching",
    },
    weekNo: {
      type: Number,
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
    },
    startPeriod: {
      type: Number,
      required: true,
    },
    endPeriod: {
      type: Number,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("LabUsage", labUsageSchema);
