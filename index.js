var prompt = require('prompt');
var config = require('./config');
var socket = require('socket.io-client')(config.socketServer || 'http://localhost:8080');
var args = require('minimist')(process.argv.slice(2));



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


if(args.n) config.name = args.n;

sendData();

function sendData() {
    var stroke = {
        message: "stroke",
        name: config.name,
        caloriesPerMinute: Math.round((Math.random() * 10) + 70),
        distance: Math.round((Math.random() * 5) + 20),
        strokeRate: Math.round((Math.random() * 5) + 20),
    };

    socket.send(stroke);
    
    setTimeout(sendData, 1000);
}