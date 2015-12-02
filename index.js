var prompt = require('prompt');
// var waterrower = require("node-waterrower/Waterrower");

// var readWaterrower = function () {
// 	console.log();
// 	console.log("Stroke Rate..." + waterrower.readStrokeCount());  // [ - ]
// 	console.log("Total Speed..." + waterrower.readTotalSpeed());   // [cm/s]
// 	console.log("Average Speed..." + waterrower.readAverageSpeed()); // [cm/s]
// 	console.log("Distance..." + waterrower.readDistance());     // [ m ]
// 	console.log("Heart Rate......" + waterrower.readHeartRate());    // [ bpm ]
// 	console.log("Calories..." + waterrower.readCalories());    // [ kcal ]
// }
var datapointBase = {
	
}
var username;

prompt.start();
var promptProps = [{
	name: 'name',
	type: 'string',
	description: 'What\'s your name?'
}]
prompt.get(promptProps, function (err, result) {
	username = result.name;
	sendData();
})
function sendData(){
	//send data
	//supplement with username and timestamp
	setTimeout(sendData, 1000);
}
