const logger = require("../util/winston");
const { Server } = require("socket.io");
const { SECRET } = require("../util/constants");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  // TODO: Add auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const authenticated = token === SECRET;

    if (authenticated) {
      next();
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connect", (socket) => {
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
      socket.broadcast.emit("new message", message);
    });
  });

  return io;
};
