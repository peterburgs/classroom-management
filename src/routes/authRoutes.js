const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

// Import Models
const User = mongoose.model("User");

const router = express.Router();

// Ensure Router use middleware
router.use(requireAuth);

// GET Method: get a user
router.get("/", async (req, res) => {
  const email = req.params.email;
  console.log("Test:", req.params.email);
  if (!email) {
    return res.status(422).json({
      message: "Email not found!",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).json({
      message: "Invalid email",
    });
  }
  return res.status(200).json({
    message: "Found",
    user,
  });
});

// Export

module.exports = router;
