const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Course = mongoose.model("Course");

const router = express.Router();

// GET Method: get all courses
router.get("/", async (req, res) => {

  try {
    const result = await Course.find({}).exec()
    if (result) {
      console.log(result)
      res.status(200).json({
        message: "Found",
        courses: result
      })
    }
  }
  catch (err) {
    console.log(err.message)
    res.status(404).json({
      message: "Not Found",
      error: err.message
    })
  }


})

// GET Method: get course by Id
router.get("/:courseId", async (req, res) => {
  const id = req.params.courseId
  try {
    const course = await Course.findOne({ _id: id })
    if (course) {
      console.log(course)
      res.status(200).json({
        message: "Found",
        course
      })
    }
  } catch (err) {
    console.log(err.message)
    res.status(404).json({
      message: "Not found",
      error: err.message
    })
  }

})


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
    const result = await Course.findByIdAndUpdate(
      { _id: id },
      { $set: updateOps },
      { new: true }
    ).exec();
    if (result) {
      res.status(201).json({ course: result });
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
