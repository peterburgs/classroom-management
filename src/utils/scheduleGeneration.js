const mongoose = require("mongoose");

// Import Models
const LabUsage = mongoose.model("LabUsage");
const Teaching = mongoose.model("Teaching");
const Semester = mongoose.model("Semester");

// Import Lodash
const _ = require("lodash");

// Schedule
const schedule = async (
  labs,
  teachings,
  numberOfWeeks,
  semesterId,
  isNew
) => {
  let teachingQueue = [];
  let labQueue = [];
  for (let teach of teachings) {
    teachingQueue.push(teach);
  }
  for (let lab of labs) {
    labQueue.push(lab);
  }
  // Sort by number of student
  for (let i = 0; i < teachingQueue.length - 1; i++) {
    for (let j = 1; j < teachingQueue.length; j++) {
      if (
        teachingQueue[i].numberOfStudents <
        teachingQueue[j].numberOfStudents
      ) {
        let temp = teachingQueue[i];
        teachingQueue[i] = teachingQueue[j];
        teachingQueue[j] = temp;
      }
    }
  }
  // Sort by capacity
  for (let i = 0; i < labQueue.length - 1; i++) {
    for (let j = 1; j < labQueue.length; j++) {
      if (labQueue[i].capacity < labQueue[j].capacity) {
        let temp = labQueue[i];
        labQueue[i] = labQueue[j];
        labQueue[j] = temp;
      }
    }
  }
  // Generate 2D array size (numberOfWeek*6days/week )*((15 period/day) *numberOfLab)
  const makeArray = (w, h, val) => {
    var arr = [];
    for (let i = 0; i < h; i++) {
      arr[i] = [];
      for (let j = 0; j < w; j++) {
        arr[i][j] = val;
      }
    }
    return arr;
  };

  // Init labSchedule
  let labSchedule = null;
  let semester = await Semester.findOne({ _id: semesterId });

  // If Admin wants to make New Schedule
  if (isNew) {
    labSchedule = makeArray(numberOfWeeks * 6, labs.length * 15, 0);
  }
  // If Admin wants to Modify an existing Schedule
  else {
    labSchedule = _.cloneDeep(semester.labSchedule);
  }

  // Scheduling
  while (teachingQueue.length) {
    let currentTeaching = teachingQueue.shift();
    for (let i = 0; i < labQueue.length; i++) {
      let isAvailable = -1;
      // Find the days that match currentTeaching.dayOfWeek
      let breakDay = false;
      for (let j = 0; j < numberOfWeeks * 6; j++) {
        if (breakDay == false)
          if (j % 6 == currentTeaching.dayOfWeek) {
            // If record is found
            // Check the periods are available for Teaching
            for (
              let period = currentTeaching.startPeriod;
              period <= currentTeaching.endPeriod;
              period++
            ) {
              // Skip occupied lab usages
              if (labSchedule[period + 15 * i][j] != 0) {
                break;
              }
              isAvailable = j;
              breakDay = true;
            }
          }
      }
      // Assign Teaching to labSchedule

      if (
        isAvailable !== -1 &&
        currentTeaching.numberOfPracticalWeeks * 12 + isAvailable <=
          numberOfWeeks * 6
      ) {
        let currentDay = isAvailable;
        while (currentTeaching.numberOfPracticalWeeks--) {
          //
          // Init lab usage
          const _labUsage = new LabUsage({
            lab: labQueue[i]._id,
            teaching: currentTeaching._id,
            weekNo: Math.floor(currentDay / 6),
            dayOfWeek: currentTeaching.dayOfWeek,
            startPeriod: currentTeaching.startPeriod,
            endPeriod: currentTeaching.endPeriod,
            isRemoved: false,
          });
          // save lab usage
          const _labUsageSave = await _labUsage.save();
          const teaching = await Teaching.findOne({
            _id: currentTeaching._id,
          });
          // Push labUsage to Teaching and Save
          await teaching.labUsages.push(_labUsageSave);
          await teaching.save();
          //
          for (
            let currentSchedulePeriod = currentTeaching.startPeriod;
            currentSchedulePeriod <= currentTeaching.endPeriod;
            currentSchedulePeriod++
          ) {
            // Mark the cell as 1 (occupied)
            labSchedule[currentSchedulePeriod + 15 * i][
              currentDay
            ] = 1;
          }
          currentDay += 12;
        }
        break;
      }
    }
  }
  //Save labSchedule just created to Semester
  semester.labSchedule = labSchedule;
  await semester.save();
  return labSchedule;
};
module.exports = schedule;
