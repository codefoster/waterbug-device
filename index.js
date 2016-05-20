var config = require('./config');
var socket = require('socket.io-client')(config.socketServer || 'http://localhost:8080');
var args = require('minimist')(process.argv.slice(2));
var waterrower = require('./waterrower');

if(args.n) config.name = args.n;
// setInterval(sendData, 500);
waterrower.on('data', sendData);

function sendData() {
    var stroke = {
        message: "strokedata",
        name: config.name,
        // distance: Math.round((Math.random() * 5) + 20),
        distance: waterrower.getData().distance,
        strokeRate: Math.round((Math.random() * 5) + 20),
    };

    console.log('sending stroke data');
    socket.send(stroke);    
}