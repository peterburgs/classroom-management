const express = require("express");
const mongoose = require("mongoose");

// Import Models
const User = mongoose.model("User");

const router = express.Router();

// GET Method: get a user
router.get("/users", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(422).json({
      message: "Email not found!",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).json({
      message: "Invalid email or password",
    });
  }
  return res.status(200).json({
    message: "Found",
    user,
  });
});

// Export

module.exports = router;
