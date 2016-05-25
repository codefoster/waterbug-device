var config = require('./config');
var args = require('minimist')(process.argv.slice(2));
var waterrower = require('./waterrower');

//command line arguments
var name = (args.n?args.n:(config.name?config.name:'Rower'));
var socketServer = (args.s?args.s:(config.socketServer?config.socketServer:'http://localhost:8080'));

console.log('name: ' + name);
console.log('socketServer: ' + socketServer);

//wire up to the socket server
var socket = require('socket.io-client')(socketServer);
socket.on("message", function(data) {
    if(data.message == 'startrace'){
        waterrower.reset();
        waterrower.startRace({ distance:data.distance });
    }
});

//respond to the waterrower sending data
waterrower.on('data', function () {
    var d = waterrower.getData();
    socket.send({
        message: "strokedata",
        name: config.name,
        distance: d.distance,
        strokeRate: d.strokeRate,
        speed: d.speed,
        clock: d.clock
    });    
});