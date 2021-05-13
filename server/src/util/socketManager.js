class SocketManager {
    constructor() {
        this.sessions = [];
    }

    addSocket(socketId, clientId) {
        this.sessions.push({
            socketId: socketId,
            clientId: clientId
        });
    }

    deleteSocket(socketId) {
        let index = this.sessions.findIndex(session => session.socketId === socketId);

        if (index > -1)
            this.sessions.splice(index, 1);
    }

    getDestinationSocket(clientId) {
        return this.sessions.find(session => session.clientId === clientId)?.socketId;
    }

    getSocketClientId(socketId) {
        return this.sessions.find(session => session.socketId === socketId)?.clientId;
    }
}

module.exports = new SocketManager();