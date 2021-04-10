var sqlite = require('sqlite3');

class SqlWrapper {

    db;
    constructor() { }

    open() {
        this.db = new sqlite.Database('../ws-app-db/ws-app.db', sqlite.OPEN_READWRITE, (err) => {
            if (err)
                console.log(err);
            console.log('connected to db');
        });
    }

    close() {
        this.db.close((err) => {
            if (err)
                console.log(err.message);
            console.log('db disconnected');
        });
    }

    query(query, callback) {
        this.db.get(query, (err, row) => {
            return callback(err, row);
        });
    }

    cud(query, callback) {
        this.db.run(query, (err) => {
            return callback(err);
        });
    }
}

module.exports = SqlWrapper;