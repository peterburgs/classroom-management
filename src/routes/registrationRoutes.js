const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Registration = mongoose.model("Registration");
const Semester = mongoose.model("Semester");
const router = express.Router();

// POST Method: Create a new Registration
router.post("/", async (req, res) => {
  const registration = new Registration({
    patch: req.body.patch,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    isOpening: req.body.isOpening,
    semesterId: req.body.semesterId,
  });
  registration.save().then((doc) => {
    Semester.findOne({ _id: registration.semesterId })
      .exec()
      .then(() => {
        Semester.update(
          { _id: registration.semesterId },
          { $push: { registrations: [registration] } }
        )
          .exec()
          .then((result) => {
            res.status(201).json({
              message: "A new Registration has been created!",
              registration: result,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Cannot create new Registration",
              err,
            });
          });
      });
  });
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
