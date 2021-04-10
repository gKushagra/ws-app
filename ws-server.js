'use strict';
var Store = require('./model/store');
var User = require('./model/user');
var { v4: uuid } = require('uuid');
var SqlWrapper = require('./helpers/sqlite');
var webSocketServer = require('ws').Server;
var httpServer = require('http').createServer();
var app = require('./http-server');

var ws = new webSocketServer({
    server: httpServer
});

// mount the app
httpServer.on('request', app);

let store = new Store();
let db = new SqlWrapper();

ws.on('connection', wss => {
    console.log('new client connected');

    wss.on('message', d => {
        let data = JSON.parse(d);
        // console.log(data);
        switch (data['requestCode']) {
            case 0:
                // get user from db
                try {
                    db.open();
                    let query = `SELECT * FROM users WHERE email="${data['user']['email']}";`;
                    db.query(query, (err, rows) => {
                        if (err) {
                            db.close();
                            console.log(err);
                        }
                        db.close();
                        // console.log(rows);
                        if (rows) {
                            wss['clientId'] = uuid();
                            let user = new User(wss['clientId'], data['user'], [], []);
                            store.add({ client: wss, user });
                            // console.log(store.getAll());
                            wss.send(JSON.stringify({ clientId: wss['clientId'] }));
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
                break;

            case 1:
                console.log(data['msg']);
                wss.send(JSON.stringify({ msg: data['msg'] }));
                break;

            case 2:
                console.log(data['search']);
                try {
                    let query = `SELECT userId,name FROM users WHERE name LIKE "${data['search']}%";`
                    db.open();
                    db.query(query, (err, rows) => {
                        if (err) {
                            db.close();
                            console.log(err);
                        }
                        db.close();
                        console.log(rows);
                        if (rows) {
                            wss.send(JSON.stringify({ searchResults: [rows] }));
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
                break;

            case 3:
                console.log(data['user'], data['pair']);
                // add new pair and send to client latest pairs
                try {
                    let query = `INSERT INTO pairs (pairId, userId, otherUserId) VALUES ("${uuid()}","${data['user']['userId']}","${data['pair']['userId']}");`
                    db.open();
                    db.cud(query, (err) => {
                        if (err) {
                            db.close();
                            console.log(err);
                        }

                        db.close();
                        store.get(wss['clientId'])['user'].addPair(data['pair']);
                        wss.send(JSON.stringify({ pairs: [data['pair']] }));
                    });
                } catch (error) {
                    console.log(error)
                }
                break;

            default:
                break;
        }

        // wss.send(data.toUpperCase());
    });

    wss.on('close', () => {
        store.remove(wss['clientId']);
        // console.log(store.getAll());
        console.log('client disconnected');
    });
});

httpServer.listen(6868, () => {
    console.log('app running on port 6868');
});
