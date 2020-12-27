const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");


// Import Models
const Lab = mongoose.model("Lab");

const router = express.Router();

// Ensure Router use middleware
router.use(requireAuth);

// GET Method: get all labs
router.get("/", async (req, res) => {
  try {
    const result = await Lab.find({ isRemoved: false }).exec();
    if (result) {
      console.log(result);
      res.status(200).json({
        message: "Found",
        labs: result,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      message: "Not Found",
      error: err.message,
    });
  }
});

// GET Method: get lab by Id
router.get("/:labId", async (req, res) => {
  const id = req.params.labId;
  try {
    const lab = await Lab.findOne({ _id: id, isRemoved: false });
    if (lab) {
      res.status(200).json({
        message: "Found",
        lab,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      message: "Not found",
      error: err.message,
    });
  }
});

// POST Method Create a new Lab
router.post("/", async (req, res) => {
  const lab = new Lab({
    labName: req.body.labName,
    capacity: req.body.capacity,
    isRemoved: req.body.isRemoved,
  });
  try {
    const result = await lab.save();
    if (result) {
      res.status(201).json({
        message: "New Lab is Created",
        lab: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot created",
      err: err.message,
    });
  }
});

// PUT Method: Edit an existing Lab
router.put("/:labId", async (req, res) => {
  const id = req.params.labId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await Lab.findByIdAndUpdate(
      { _id: id, isRemoved: false },
      { $set: updateOps },
      { new: true }
    ).exec();
    if (result) {
      res.status(201).json({ lab: result });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot created",
      err: err.message,
    });
  }
});

// Delete Method: Delete an existing Lab
router.delete("/:labId", async (req, res) => {
  const id = req.params.labId;
  try {
    const result = await Lab.findByIdAndUpdate(
      { _id: id, isRemoved: false },
      { $set: { isRemoved: true } }
    ).exec();
    if (result) {
      res.status(201).json({ lab: result });
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
