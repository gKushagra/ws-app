'use strict';
require('dotenv').config();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var session = require('express-session');
var { v4: uuid } = require('uuid');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    if (!req.session.sessionId) {
        req.session.sessionId = uuid();
    }

    console.log(req.session.sessionId);
    res.render('index', { sessionId: req.session.sessionId });
});

module.exports = app;
