var EventEmitter = require('events');
var serialport = require('serialport');

var PORT_NAME = '/dev/ttyACM0';
var BAUD_RATE = '19200'; //TODO: experiment with faster (i.e. 115200)
var REFRESH_RATE = 200;
var events = new EventEmitter();

var state = {
    distance_l: 0,
    distance_h: 0,
    strokeRate: 0,
    speed_l: 0,
    speed_h: 0,    
}

var port = new serialport.SerialPort(PORT_NAME, {
    baudrate: BAUD_RATE,
    disconnectedCallback: function () { console.log('disconnected'); },
    parser: serialport.parsers.readline("\n")
});

port.on('open', function () {
    console.log('connection open');

    send('USB'); //start things off
    send('DDME'); //change the display to meters
    send('RESET'); //reset the waterrower 

    // port.write('WSI1' + decToHex(500)); //set the workout to 500 meters
    // port.write('IV?\r\n'); //ask the waterrower for its model

    setInterval(function () {
        //request data
        send('IRS055');
        send('IRS056');
        send('IRS14A');
        send('IRS14B');
    }, REFRESH_RATE);
});

//this is the declarative list of things to do when the waterrower sends us a message
var actions = [
    {
        name: 'distance (low byte)',
        pattern: /IDS055([\dA-F]+)/,
        action: function (matches) {
            if (state.distance_l != matches[1]) 
                state.distance_l = matches[1];
        }
    },
    {
        name: 'distance (high byte)',
        pattern: /IDS056([\dA-F]+)/,
        action: function (matches) {
            if (state.distance_h != matches[1]) {
                state.distance_h = matches[1];
                events.emit('data');
            }
        }
    },
    {
        name: 'speed (low byte)',
        pattern: /IDS14A([\dA-F]+)/,
        action: function (matches) {
            if (state.speed_l != matches[1]) 
                state.speed_l = matches[1];
        }
    },
    {
        name: 'speed (high byte)',
        pattern: /IDS14B([\dA-F]+)/,
        action: function (matches) {
            if (state.speed_h != matches[1]) {
                state.speed_h = matches[1];
                events.emit('data');
            }
        }
    },
    {
        name: 'stroke rate',
        pattern: /IDS142([\dA-F]+)/,
        action: function (matches) {
            if (state.strokeRate != matches[1]) {
                state.strokeRate = matches[1];
                events.emit('data');
            }
        }
    },
    {
        name: 'pulse',
        pattern: /P(\d+)/,
        action: null
    }
];

//when a message is received, apply the appropriate action
port.on('data', function (data) {
    actions.forEach(function (a) {
        var matches = a.pattern.exec(data);
        if (matches && a.action) a.action(matches);
    });
});

port.on('closed', function () { console.log('connection closed'); });
port.on('error', function (err) { console.log('connection error'); });

function send(value) {
    // console.log('Sending: ' + value);
    port.write(value + '\r\n');
}

function hexToDec(input) {
    var value;
    var total = 0;
    for (var i = 0; i < input.length; i++) {
        total = total * 16;
        value = input.charCodeAt(i) - 48;
        if (value > 9) {
            value = value - 7;
        }
        total = total + value;
    }
    return (total);
}

function decToHex(input) {
    var value;
    var total = 0;
    for (var i = input.length - 1; i >= 0; i--) {
        total = total * 16;
        value = input.charCodeAt(i) - 48;
        if (value > 9) {
            value = value - 7;
        }
        total = total + value;
    }
    return (total);
}

events.getData = function() {
    return {
        distance: hexToDec(state.distance_h + '' + state.distance_l),
        strokeRate: hexToDec(state.strokeRate),
        speed: hexToDec(state.speed_h + '' + state.speed_l)
    }
}

module.exports = events;
