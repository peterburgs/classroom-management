const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const Semester = mongoose.model("Semester");
const router = express.Router();

// Ensure Router use middleware
router.use(requireAuth);

// GET Method: get a Semester
// TODO: attach list of registration belongs to that semester
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
router.post("/", (req, res) => {
  if (req.body.role === "LECTURER" || req.body.role === "") {
    return res.status(403).json({
      message: "ADMIN authorization required!",
    });
  }

  console.log(req.body);

  const semester = new Semester({
    semesterName: req.body.semesterName,
    startDate: req.body.startDate,
    numberOfWeeks: req.body.numberOfWeeks,
    isOpening: req.body.isOpening,
  });

  semester
    .save()
    .then((doc) => {
      res.status(201).json({
        message: "Semester is saved successfully",
        semester: doc,
      });
    })
    .catch((err) => {
      console.log("*Error: Cannot create Semester");
      res.status(500).json({
        message: "Cannot create new Semester",
        err,
      });
    });
});

// PUT Method: Update an existing Semester
router.put("/:semesterId", (req, res) => {
  const id = req.params.semesterId;
  console.log("req.body: ", req.body);
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  Semester.findByIdAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
    .populate("registrations")
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: err });
    });
});
module.exports = router;
