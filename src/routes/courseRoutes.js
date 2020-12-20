const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Course = mongoose.model("Course");

const router = express.Router();

// POST Method Create a new Course
router.post("/", async (req, res) => {
  const course = new Course({
    courseName: req.body.courseName,
    numberOfCredits: req.body.numberOfCredits,
  });
  try {
    const result = await course.save();
    if (result) {
      res.status(201).json({
        message: "New Course is Created",
        course: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot created",
      err: err.message,
    });
  }
});

// PUT Method: Edit an existing Course
router.put("/:courseId", async (req, res) => {
  const id = req.params.courseId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await Course.updateOne(
      { _id: id },
      { $set: updateOps }
    ).exec();
    if (result) {
      res.status(201).json({ result });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot created",
      err: err.message,
    });
  }
});
// Export

module.exports = router;
