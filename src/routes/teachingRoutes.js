const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Teaching = mongoose.model("Teaching");

const router = express.Router();

// POST Method Create a new Teaching
router.post("/", async (req, res) => {
  if (req.role !== "LECTURER") {
    return res.status(403).json({
      message: "Only LECTURER can create new Teaching",
    });
  }
  const teaching = new Teaching({
    userId: req.body.userId,
    courseId: req.body.courseId,
    group: req.body.group,
    dayOfWeek: req.bodyday.OfWeek,
    startPeriod: req.body.startPeriod,
    endPeriod: req.body.endPeriod,
    numberOfStudents: req.body.numberOfStudents,
    theoryRoom: req.body.theoryRoom,
    numberOfPracticalWeeks: req.body.numberOfPracticalWeeks,
    registrationId: req.body.registrationId,
  });
  teaching
    .save()
    .then((doc) => {
      res.status(201).json({
        message: "Created",
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
router.put("/:teachingId", (req, res) => {
  const id = req.params.teachingId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  Teaching.updateOne({ _id: id }, { $set: updateOps })
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
