const schedule = function (labs, teachings, numberOfWeek) {
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
  let labSchedule = makeArray(numberOfWeek * 6, labs.length * 15, 0);
  // Scheduling
  while (teachingQueue.length) {
    let currentTeaching = teachingQueue.shift();
    for (let i = 0; i < labQueue.length; i++) {
      let isAvailable = -1;
      // Find the days that match currentTeaching.dayOfWeek
      let breakDay = false;
      for (let j = 0; j < 90; j++) {
        if (breakDay == false)
          if (j % 6 == currentTeaching.dayOfWeek) {
            // If record is found
            // Check the periods are available for Teaching
            for (
              let period = currentTeaching.startPeriod;
              period <= currentTeaching.endPeriod;
              period++
            ) {
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
          90
      ) {
        let currentDay = isAvailable;
        while (currentTeaching.numberOfPracticalWeeks--) {
          for (
            let currentSchedulePeriod = currentTeaching.startPeriod;
            currentSchedulePeriod <= currentTeaching.endPeriod;
            currentSchedulePeriod++
          ) {
            labSchedule[currentSchedulePeriod + 15 * i][currentDay] =
              currentTeaching.course;
          }
          currentDay += 12;
        }
        break;
      }
    }
  }
  return labSchedule;
};
module.exports = schedule;
