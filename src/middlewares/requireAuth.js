const mongoose = require("mongoose");

// Models
const User = mongoose.model("User");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Verify Token
const googleAuth = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message: "Not authenticated yet. Authentication required!",
    });
  }
  const token = authorization.split(" ")[1];
  try {
    const user = await googleAuth(token);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: err.message,
    });
  }
};
