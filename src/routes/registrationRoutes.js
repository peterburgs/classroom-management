const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

// Import Models
const Registration = mongoose.model("Registration");
const Semester = mongoose.model("Semester");
const RegistrableCourse = mongoose.model("RegistrableCourse");
const Course = mongoose.model("Course");
const router = express.Router();

// Ensure Router use middleware
router.use(requireAuth);

// POST Method: Create a new Registration
router.post("/", async (req, res) => {
  try {
    const semesterResult = await Semester.findOne({
      _id: req.body.semester,
    }).exec();
    if (semesterResult) {
      const registration = new Registration({
        patch: req.body.patch,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isOpening: req.body.isOpening,
        semester: semesterResult._id,
      });

      const registrationResult = await registration.save();
      semesterResult.registrations.push(registrationResult);
      await semesterResult.save();

      // Save Registrable course
      for (let i = 0; i < req.body.registrableCourses.length; i++) {
        try {
          const courseResult = await Course.findOne({
            _id: req.body.registrableCourses[i],
          });

          if (courseResult) {
            const registrableCourse = new RegistrableCourse({
              course: courseResult._id,
              registration: registrationResult._id,
            });

            const registrableCourseResult = await registrableCourse.save();
            registrationResult.registrableCourses.push(
              registrableCourseResult
            );
            await registrationResult.save();
          }
        } catch (err) {
          console.log(err);
        }
      }

      res.status(201).json({ message: "Registration created" });
    } else {
      res.status(404).json({ message: "Cannot find semester" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// PUT Method: Update an existing registration
router.put("/:registrationId", async (req, res) => {
  const id = req.params.registrationId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await Registration.updateOne(
      { _id: id },
      { $set: updateOps }
    ).exec();
    if (result) {
      res.status(200).json({
        registration: result,
      });
    }
  } catch (err) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

// GET Method: get number of opening registrations
router.get("/opening", async (req, res) => {
  try {
    const openingRegistration = await Registration.findOne({
      isOpening: true,
    });
    if (openingRegistration) {
      res.status(200).json({
        message: "Found",
        count: 1,
        openingRegistration: openingRegistration,
      });
    } else {
      res.status(200).json({
        message: "No Registration is opening",
        openingRegistration: openingRegistration,
        count: 0,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
      count: 0,
    });
  }
});

// Export
module.exports = router;
