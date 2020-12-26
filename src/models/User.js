const mongoose = require("mongoose");
const rolesEnum = require("../enums/roles");
// Schema
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      default: "New User",
    },
    roles: {
      type: Array,
      default: [rolesEnum.LECTURER],
    },
    isRemoved: {
      type: Boolean,
      required: true,
    },
    teachings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teaching",
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("User", userSchema);
