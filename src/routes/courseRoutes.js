const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Course = mongoose.model("Course");

const router = express.Router();

// POST Method Create a new Teaching
router.post("/", async (req, res) => {
  const course = new Course({
    courseName: req.body.courseName,
    numberOfCredits: req.body.numberOfCredits,
  });
  course
    .save()
    .then((doc) => {
      res.status(201).json({
        message: "New Course is Created",
        user: doc,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Cannot created",
        err,
      });
    });
});

// PUT Method: Edit an existing teaching
router.put("/:courseId", (req, res) => {
  const id = req.params.courseId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  Course.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: err });
    });
});
// Export

module.exports = router;
