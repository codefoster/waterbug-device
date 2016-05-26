"use strict";
var config_1 = require('./config');
var minimist = require('minimist');
var io = require('socket.io-client');
var args = minimist(process.argv.slice(2));
var waterrower_1 = require('waterrower');
var config = new config_1.Config();
var waterrower = new waterrower_1.WaterRower();
//command line arguments
var rowerName = (args["n"] ? args["n"] : (config.name ? config.name : 'Rower'));
var socketServerUrl = (args["s"] ? args["s"] : (config.socketServerUrl ? config.socketServerUrl : 'http://localhost:8080'));
console.log("Using " + rowerName + " as rower name.");
console.log("Attempting to connect to " + socketServerUrl);
//wire up to the socket server
var socket = io(socketServerUrl);
socket.on("message", function (data) {
    if (data.message == 'startrace') {
        waterrower.reset();
        waterrower.startRace({ distance: data.distance });
    }
});
//respond to the waterrower sending data
waterrower.data.subscribe(function () {
    var d = waterrower.getData();
    socket.send({
        message: "strokedata",
        name: rowerName,
        distance: d.distance,
        strokeRate: d.strokeRate,
        speed: d.speed,
        clock: d.clock
    });
});
//# sourceMappingURL=index.js.map