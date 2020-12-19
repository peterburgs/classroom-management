const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Registration = mongoose.model("Registration");
const Semester = mongoose.model("Semester");
const router = express.Router();

// POST Method: Create a new Registration
router.post("/", async (req, res) => {
  try {
    const semesterResult = await Semester.findOne({ _id: req.body.semesterId }).exec();
    if (semesterResult) {
      const registration = new Registration({
        patch: req.body.patch,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isOpening: req.body.isOpening,
        semesterId: semesterResult._id,
      });

      const registrationResult = await registration.save();
      semesterResult.registrations.push(registrationResult);
      await semesterResult.save();
      res.status(201).json({ message: "registration created" });
    } else {
      res.status(404).json({ message: "Cannot find semester" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// PUT Method: Update an existing registration
router.put("/:registrationId", (req, res) => {
  const id = req.params.registrationId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  Registration.updateOne({ _id: id }, { $set: updateOps })
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
