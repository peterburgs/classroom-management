// Import Models
require("./models/User");
require("./models/Semester");
require("./models/Registration");
require("./models/Teaching");
require("./models/Course");
require("./models/Lab");
require("./models/RegistrableCourse");
require("./models/LabUsage");

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// Middlewares
const requireAuth = require("./middlewares/requireAuth");

// Routers
const authRoutes = require("../src/routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const teachingRoutes = require("./routes/teachingRoutes");
const courseRoutes = require("./routes/courseRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const labRoutes = require("./routes/labRoutes");
// Config app

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Test connection status
mongoose.connection.on("connected", () => {
  console.log("*LOG: Connected to MongoDB successfully!");
});
mongoose.connection.on("error", () => {
  console.log("*LOG: Fail to connect to MongoDB!");
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Handle header
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

// Use Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/semesters", semesterRoutes);
app.use("/registrations", registrationRoutes);
app.use("/teachings", teachingRoutes);
app.use("/courses", courseRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/labs", labRoutes);

app.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.name}`,
  });
});

//Handle 404 error
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
