class User {

    clientId;
    user; //{ userId: null, name: null, email: null, joined: null, }
    pairs = [];
    groups = [];

    /**
     * 
     * @param {*} clientId Created when a user is active
     * @param {*} user User info object
     * @param {*} pairs Users friends
     * @param {*} groups Users groups
     */
    constructor(clientId, user, pairs, groups) {
        this.clientId = clientId;
        this.user = user;
        this.pairs = pairs;
        this.groups = groups;
    }

    getMsgHistoryPair() { }
    getMsgHistoryGroup() { }
    addPair() { }
    removePair() { }
    addMsgPair() { }
    removeMsgPair() { }
    addGroup() { }
    removeGroup() { }
    addMsgGroup() { }
    removeMsgGroup() { }
    getPairDetail() { }
    getGroupDetail() { }
    getUserDetail() { }
}

module.exports = User