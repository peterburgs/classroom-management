const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const user = {
    username: "peter",
    email: "peterburgs.vn@gmail.com",
  };
  res.status(200).json({
    message: "You get a user",
    user,
  });
});

module.exports = router;
