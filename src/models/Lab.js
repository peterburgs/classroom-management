const mongoose = require("mongoose");

// Schema
const labSchema = new mongoose.Schema(
  {
    labName: {
      type: String,
      required: true,
    },
    capacity: {
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

mongoose.model("Lab", labSchema);
