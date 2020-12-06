const mongoose = require("mongoose");
const rolesEnum = require("../enums/roles");
// Schema
const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

mongoose.model("User", userSchema);
