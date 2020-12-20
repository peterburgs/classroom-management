const express = require("express");
const mongoose = require("mongoose");

// Import Models
const User = mongoose.model("User");

const router = express.Router();

// POST Method Create user
router.post("/", async (req, res) => {
  const user = new User({
    email: req.body.email,
    fullname: req.body.fullname,
    roles: req.body.role,
  });
  try {
    const result = await user.save();
    if (result) {
      res.status(201).json({
        message: "Created",
        user: doc,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot created",
      err,
    });
  }
});

// Export

module.exports = router;
