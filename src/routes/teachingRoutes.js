const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

// Import Models
const Teaching = mongoose.model("Teaching");
const User = mongoose.model("User");
const Registration = mongoose.model("Registration");

// Router
const router = express.Router();

// Ensure Router use middleware
router.use(requireAuth);

// GET Method: get all valid teaching (isRemove=false)
router.get("/:userId", async (req, res) => {
  const id = req.params.userId;
  try {
    const result = await Teaching.find({
      user: id,
      isRemoved: false,
    }).populate("user course");
    if (result) {
      res.status(200).json({
        message: "Found all teachings",
        teachings: result,
      });
    } else {
      res.status(404).json({
        message: "No teaching found",
        teachings: result,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET Method: get a specific teaching by Id
router.get("/find/:teachingId", async (req, res) => {
  const id = req.params.teachingId;
  try {
    const result = await Teaching.findOne({
      _id: id,
      isRemoved: false,
    });
    if (result) {
      res.status(200).json({
        message: "Found",
        teaching: result,
      });
    } else {
      res.status(404).json({
        message: "No teaching found",
        teaching: result,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
    });
  }
});

// POST Method Create a new Teaching
router.post("/", async (req, res) => {
  if (req.body.role !== "LECTURER") {
    return res.status(403).json({
      message: "Only LECTURER can create new Teaching",
    });
  }
  const teaching = new Teaching({
    user: req.body.user,
    course: req.body.course,
    group: req.body.group,
    dayOfWeek: req.body.dayOfWeek,
    startPeriod: req.body.startPeriod,
    endPeriod: req.body.endPeriod,
    numberOfStudents: req.body.numberOfStudents,
    theoryRoom: req.body.theoryRoom,
    numberOfPracticalWeeks: req.body.numberOfPracticalWeeks,
    registration: req.body.registration,
    isRemoved: req.body.isRemoved,
  });
  try {
    const _user = await User.findOne({ _id: req.body.user });
    const _registration = await Registration.findOne({
      _id: req.body.registration,
    });
    const result = await teaching.save();
    // Update
    await _user.teachings.push(result);
    await _registration.teachings.push(result);

    // Save
    await _user.save();
    await _registration.save();
    const afterResult = await Teaching.findOne({ _id: result._id })
      .populate("user course")
      .exec();
    if (result) {
      res.status(201).json({
        message: "Created",
        teaching: afterResult,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cannot created",
      err,
    });
  }
});

// PUT Method: Edit an existing teaching
router.put("/:teachingId", async (req, res) => {
  const id = req.params.teachingId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await Teaching.findByIdAndUpdate(
      { _id: id },
      { $set: updateOps },
      { new: true }
    )
      .populate("user course")
      .exec();
    if (result) {
      res.status(200).json({ message: "Updated", teaching: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: err.message });
  }
});

// Delete Method: Delete an existing teachings
router.delete("/:teachingId", async (req, res) => {
  const id = req.params.teachingId;
  try {
    const result = await Teaching.findByIdAndUpdate(
      { _id: id, isRemoved: false },
      { $set: { isRemoved: true } }
    ).exec();
    if (result) {
      res.status(201).json({ teaching: result });
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
