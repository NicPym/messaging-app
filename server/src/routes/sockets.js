const logger = require("../util/winston");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/constants");
const socketManager = require("../util/socketManager");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    let decodedToken = "";

    try {
      decodedToken = jwt.verify(token, SECRET);
      socketManager.addSocket(socket.id, decodedToken.user.id);
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on("connect", (socket) => {
    logger.log({
      logger: "info",
      message: `[sockets.js]\tNew client connected using websocket`,
    });

    socket.on("disconnect", () => {
      socketManager.deleteSocket(socket.id);

      logger.log({
        logger: "info",
        message: `[sockets.js]\tClient disconnected from websocket`,
      });
    });

    socket.on("send message", (message) => {
      logger.log({
        logger: "info",
        message: `[sockets.js]\tMessage Received from socket ${socket.id}: ${message.description}`,
      });

      let messageObj = {
        chatId: message.chatId,
        description: message.description,
        timestamp: message.timestamp,
        sourceClientId: socketManager.getSocketClientId(socket.id)
      };

      let destinationSocketId = socketManager.getDestinationSocket(
        "100226275741937190336" != socketManager.getSocketClientId(socket.id) ? 
        "100226275741937190336" : "112922689231400104588");

      if (destinationSocketId != null) 
        socket.broadcast.to(destinationSocketId).emit("new message", messageObj);
    });
  });

  return io;
};
