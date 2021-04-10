'use strict';
require('dotenv').config();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var session = require('express-session');
var { v4: uuid } = require('uuid');
var SqlWrapper = require('./helpers/sqlite');
var bcrypt = require('bcrypt');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static('assets'));

app.set('view engine', 'ejs');

let db = new SqlWrapper();

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
        let query = `SELECT * FROM users WHERE email="${email}";`
        db.open();
        db.query(query, (err, rows) => {
            if (err) {
                db.close();
                res.sendStatus(500);
            }

            // console.log(rows);
            if (rows) {
                let isValidPassword = bcrypt.compareSync(password, rows['password']);
                if (isValidPassword) {
                    if (!req.session.sessionId) {
                        req.session.sessionId = uuid();
                        req.session.userId = rows['userId'];
                    }

                    res.redirect('/app');
                } else {
                    db.close();
                    res.redirect('/login');
                }

            } else {
                db.close();
                res.redirect('/login');
            }
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const { email, name, password } = req.body;
    // console.log(req.body);

    try {
        const hash = bcrypt.hashSync(password, 10);
        let query = `SELECT * FROM users WHERE email="${email}";`
        db.open();
        db.query(query, (err, rows) => {
            if (err) {
                db.close();
                res.sendStatus(500);
            }

            // console.log(rows);
            // insert into db
            if (!rows) {
                query = `INSERT INTO users (userId, email, name, password, joined)
                VALUES ("${uuid()}","${email}","${name}","${hash}","${new Date().toLocaleDateString('en-US')}");`
                db.cud(query, (err) => {
                    if (err) {
                        db.close();
                        res.sendStatus(500);
                    }

                    if (!req.session.sessionId) {
                        req.session.sessionId = uuid();
                    }

                    res.redirect('/app');
                });
            }
        });
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
    }
});

app.post('/logout', (req, res) => {
    req.session.sessionId = null;
    res.redirect('login');
})

app.get('/app', (req, res) => {
    // console.log(req.session.sessionId);
    if (req.session.sessionId && req.session.userId) {
        try {
            let query = `SELECT * FROM users WHERE userId="${req.session.userId}";`;
            db.open();
            db.query(query, (err, rows) => {
                if (err) {
                    db.close();
                    res.redirect('/login');
                }

                db.close();
                // console.log(rows);
                if (rows)
                    res.render('app', { sessionId: req.session.sessionId, data: JSON.stringify(rows) });
                else
                    res.redirect('/login');
            });
        } catch (error) {
            console.log(error);
            res.redirect('/login');
        }
    } else
        res.redirect('/login');
});

module.exports = app;
