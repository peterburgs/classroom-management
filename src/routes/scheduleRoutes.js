const express = require("express");
const mongoose = require("mongoose");

// Import algorithm
const schedule = require("../utils/scheduleGeneration");

// Import Models
const Lab = mongoose.model("Lab");
const Teaching = mongoose.model("Teaching");
const LabUsage = mongoose.model("LabUsage");
const Semester = mongoose.model("Semester");
const Registration = mongoose.model("Registration");
// Import requireAuth
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

// Ensure Router use middleware
//router.use(requireAuth);

// POST Method: generate schedule and return to client
router.post("/generate", async (req, res) => {
  const registrationId = req.body.registrationId;
  const isNew = req.body.isNew;
  try {
    await LabUsage.deleteMany({});
    const labs = await Lab.find({}).exec();
    const teachings = await Teaching.find({
      registration: registrationId,
    })
      .populate("course")
      .exec();
    const registration = await Registration.findOne({
      _id: registrationId,
    })
      .populate("semester")
      .exec();

    // Use algorithm to generate schedule
    const _schedule = await schedule(
      labs,
      teachings,
      registration.semester.numberOfWeeks,
      registration.semester._id,
      isNew
    );

    if (_schedule) {
      res.status(200).json({
        message: "Successfully generate schedule",
        registration,
        semester: registration.semester,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot get",
      error: err.message,
    });
  }
});

// Export
module.exports = router;
