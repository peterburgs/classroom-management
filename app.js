const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// App
const app = express();
//TODO: remove log
console.log("*LOG: App is running");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dbPeter:" +
    process.env.MONGO_ATLAS_PW +
    "@lab-management-cluster.zaxn3.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, PUT, DELETE, PATCH, GET"
    );
    return res.status(200).json({});
  }
  next();
});

//Handle unexpected errors
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// Handle other error codes
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
