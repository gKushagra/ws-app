class Store {

    activeUsers = [];

    constructor() { }

    add(user) {
        this.activeUsers.push(user);
    }

    remove(clientId) {
        this.activeUsers = this.activeUsers.filter(user => {
            return user['client']['clientId'] !== clientId
        });
    }

    get(clientId) {
        return this.activeUsers.filter(user => {
            return user['client']['clientId'] === clientId
        })[0];
    }

    getAll() {
        return this.activeUsers;
    }
}

module.exports = Store;