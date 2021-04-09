'use strict';

var webSocketServer = require('ws').Server;
var httpServer = require('http').createServer();
var app = require('./http-server');

var ws = new webSocketServer({
    server: httpServer
});

// mount the app
httpServer.on('request', app);

ws.on('connection', ws => {
    console.log('new client connected');

    ws.on('message', data => {
        console.log(data);

        ws.send(data.toUpperCase());
    });

    ws.on('close', () => {
        console.log('client disconnected');
    });
});

httpServer.listen(6868, () => {
    console.log('app running on port 6868');
});
