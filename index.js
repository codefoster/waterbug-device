var config = require('./config');
var socket = require('socket.io-client')(config.socketServer || 'http://localhost:8080');
var args = require('minimist')(process.argv.slice(2));
var waterrower = require('./waterrower');

if(args.n) config.name = args.n;
setInterval(sendData, 500);

function sendData() {
    var stroke = {
        message: "stroke",
        name: config.name,
        // caloriesPerMinute: Math.round((Math.random() * 10) + 70),
        // distance: Math.round((Math.random() * 5) + 20),
        distance: waterrower.distance(),
        strokeRate: Math.round((Math.random() * 5) + 20),
    };

    socket.send(stroke);    
}