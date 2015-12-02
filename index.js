var prompt = require('prompt');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var config = require('./config');

// var db = monk(config.mongoConnectionString);
mongoose.connect('mongodb://waterbugwin.cloudapp.net:27017/waterbug');
var DataPoint = mongoose.model('DataPoint', {
		name: String,
		strokeRate: Number,
		totalSpeed: Number,
		averageSpeed: Number,
		distance: Number,
		heartRate: Number,
		calories: Number
	}
)


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

var dp;
var name;

prompt.start();
var promptProps = [{
	name: 'name',
	type: 'string',
	description: 'What\'s your name?'
}]
prompt.get(promptProps, function (err, result) {
	if(err) throw err;
	name = result.name;
	sendData();
})


function sendData(){
	//send data
	dp = new DataPoint(randomDataPoint());
	dp.save(function(err){
		if(err) throw err;
	})
		
	setTimeout(sendData, 1000);
}

function randomDataPoint(){
	return {
		name: name,
		strokeRate: Math.floor((Math.random() * 20)) + 40,
		totalSpeed: Math.floor((Math.random() * 40)) + 78,
		averageSpeed: Math.floor((Math.random() * 5)) + 54,
		distance: Math.floor((Math.random() * 5)) + 12,
		heartRate: Math.floor((Math.random() * 10)) + 95,
		calories: Math.floor((Math.random() * 45)) + 90
	}
}