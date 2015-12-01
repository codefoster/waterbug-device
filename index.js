var waterrower = require("./Waterrower");

var readWaterrower = function () {
	console.log();
	console.log("Stroke Rate..." + waterrower.readStrokeCount());  // [ - ]
	console.log("Total Speed..." + waterrower.readTotalSpeed());   // [cm/s]
	console.log("Average Speed..." + waterrower.readAverageSpeed()); // [cm/s]
	console.log("Distance..." + waterrower.readDistance());     // [ m ]
	console.log("Heart Rate......" + waterrower.readHeartRate());    // [ bpm ]
	console.log("Calories..." + waterrower.readCalories());    // [ kcal ]
}