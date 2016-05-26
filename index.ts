import { Observable, Subject} from 'rxjs/Rx';
import { Config } from './config';
import * as minimist from 'minimist';
import * as io from 'socket.io-client';

var args = minimist(process.argv.slice(2));
import { WaterRower } from 'waterrower';

let config = new Config();
let waterrower = new WaterRower();

//command line arguments
let rowerName = (args["n"] ? args["n"] : (config.name ? config.name : 'Rower'));
let socketServerUrl = (args["s"] ? args["s"] : (config.socketServerUrl ? config.socketServerUrl : 'http://localhost:8080'));

console.log(`Using ${rowerName} as rower name.`);
console.log(`Attempting to connect to ${socketServerUrl}`);

//wire up to the socket server
var socket = io(socketServerUrl);
socket.on("message", data => {
    if (data.message == 'startrace') {
        waterrower.reset();
        waterrower.startRace({ distance: data.distance });
    }
});

//respond to the waterrower sending data
waterrower.data.subscribe(() => {
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