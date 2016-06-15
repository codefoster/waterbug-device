import { Observable } from 'rxjs/Rx';
import config from './config';
import * as minimist from 'minimist';
import * as io from 'socket.io-client';

var args = minimist(process.argv.slice(2));
import { WaterRower, Units } from 'waterrower';

let waterrower = new WaterRower({
    portName:"COM6"
});

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
        waterrower.defineDistanceWorkout(data.distance, Units.Meters);
    }
});

console.log('waiting for datapoints...');
// respond to the waterrower sending data
// only if the data sent is one of the values we care about
waterrower.datapoints$
    .filter(d => ['distance','stroke_average','speed_average','clock_down'].some(n => d.name === n))
    .subscribe(d => {
        //we're not using d here because it has the value for a single datapoint, but we want to return all of these values together when any one of them changes
        let message = {
            message: "strokedata",
            name: rowerName,
            distance: waterrower.readDataPoint('distance'),
            stroke_average: waterrower.readDataPoint('stroke_average'),
            speed_average: waterrower.readDataPoint('speed_average'),
            clock_down: waterrower.readDataPoint('clock_down')
        };
        socket.send(message);
    });