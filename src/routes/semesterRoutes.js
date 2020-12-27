const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const Semester = mongoose.model("Semester");
const router = express.Router();

// Ensure Router use middleware
router.use(requireAuth);

// GET Method: get a Semester
router.get("/", async (req, res) => {
  try {
    const result = await Semester.findOne({ isOpening: true })
      .populate("registrations")
      .exec();
    if (result) {
      res.status(200).json({
        message: "Found",
        count: result.length,
        semester: result,
      });
    } else {
      res.status(200).json({
        message: "No semester is opening",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

// POST Method: create a new Semester
router.post("/", async (req, res) => {
  if (req.body.role === "LECTURER" || req.body.role === "") {
    return res.status(403).json({
      message: "ADMIN authorization required!",
    });
  }
  const semester = new Semester({
    semesterName: req.body.semesterName,
    startDate: req.body.startDate,
    numberOfWeeks: req.body.numberOfWeeks,
    isOpening: req.body.isOpening,
  });
  try {
    const result = await semester.save();
    if (result) {
      res.status(200).json({
        message: "Semester is saved successfully",
        semester: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot create new Semester",
      err,
    });
  }
});

// PUT Method: Update an existing Semester
router.put("/:semesterId", async (req, res) => {
  const id = req.params.semesterId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await Semester.findByIdAndUpdate(
      { _id: id },
      { $set: updateOps },
      { new: true }
    )
      .populate("registrations")
      .exec();
    if (result) {
      res.status(200).json({
        message: "Semester is saved successfully",
        semester: result,
      });
    }
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
