const logger = require("../util/winston");
const { Server } = require("socket.io")

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:4200",
            credentials: true,
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }
    });

    io.on("connect", socket => {
        logger.log({
            logger: "info",
            message: `[sockets.js]\tNew client connected using websocket`,
          });
    
        socket.on("disconnect", () => {
            logger.log({
                logger: "info",
                message: `[sockets.js]\tClient disconnected from websocket`,
              });
        });
    
        socket.on("send message", (message) => {
            logger.log({
                logger: "info",
                message: `[sockets.js]\tMessage Received from websocket: ${message.message}`,
              });
        });
    });

    return io;
};