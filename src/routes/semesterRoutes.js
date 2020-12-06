const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const Semester = mongoose.model("Semester");
const router = express.Router();

// Ensure Router use middleware
router.use(requireAuth);

// GET Method: get a track
// TODO: attach list of registration belongs to that semester
router.get("/", async (req, res) => {
  const semester = await Semester.find({ isOpening: true });
  if (!semester) {
    return res.status(404).json({
      message: "No semester is opening",
    });
  }
  return res.status(200).json({
    message: "Found",
    semester,
  });
});

// POST Method: create a new Semester
router.post("/", async (req, res) => {
  if (req.role === "LECTURER" || !req.role) {
    return res.status(403).json({
      message: "ADMIN authorization required!",
    });
  }
  const semester = new Semester({
    name: req.semesterName,
    startDate: req.startDate,
    numberOfWeeks: req.numberOfWeeks,
    isOpening: req.isOpening,
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
  Semester.updateOne({ _id: id }, { $set: updateOps })
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
