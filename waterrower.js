//TODO: use Rx for handling serial port communication

var serialport = require('serialport');

var PORT_NAME = '/dev/ttyACM0';
var BAUD_RATE = '19200'; //TODO: experiment with faster (i.e. 115200)
var REFRESH_RATE = 200;

/*
TODO: use this to detect a water rower instead of hard coding
a waterrower returns the following port object from a .list function
{
    "comName":"/dev/ttyACM0",
    "manufacturer":"Microchip_Technology_Inc.",
    "serialNumber":"Microchip_Technology_Inc._CDC_RS-232:_WR-S4.2",
    "pnpId":"usb-Microchip_Technology_Inc._CDC_RS-232:_WR-S4.2-if00",
    "vendorId":"0x04d8",
    "productId":"0x000a"
}
*/

var state = {
    distance_l: 0,
    distance_h: 0
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

    // port.write('WSI1' + DecimalToACH(500)); //set the workout to 500 meters
    // port.write('IV?\r\n'); //ask the waterrower for its model

    setInterval(function () {
        send('IRS055');
        send('IRS056');
    }, REFRESH_RATE);
});

//this is the declarative list of things to do when the waterrower sends us a message
var actions = [
    {
        name: 'distance (high byte)',
        pattern: /IDS056([\dA-F]+)/,
        action: function (matches) { state.distance_h = matches[1]; }
    },
    {
        name: 'distance (high byte)',
        pattern: /IDS055([\dA-F]+)/,
        action: function (matches) { state.distance_l = matches[1]; }
    },
    {
        pattern: /P(\d+)/,
        action: null
    }
];

//build regular expressions for each action
actions.forEach(function (a) { a.re = new RegExp(a.pattern); });

//when a message is received, apply the appropriate action
port.on('data', function (data) {
    actions.forEach(function (a) {
        var matches = a.re.exec(data);
        if (matches && a.action) a.action(matches);
    });
});

port.on('closed', function () { console.log('connection closed'); });
port.on('error', function (err) { console.log('connection error'); });

function send(value) {
    // console.log('Sending: ' + value);
    port.write(value + '\r\n');
}

function AchToDecimal(input) {
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

function DecimalToACH(input) {
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

module.exports = {
    distance: function() {
        return AchToDecimal(state.distance_h + state.distance_l);
    }
}