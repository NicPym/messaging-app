const logger = require("../util/winston");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/constants");
const socketManager = require("../util/socketManager");
const { sequelize } = require("../models");
const models = sequelize.models;

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
      socketManager.addSocket(socket.id, decodedToken.id);
      next();
    } catch (err) {
      next(new Error("Authentication error"));
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
      const senderId = socketManager.getSocketClientId(socket.id);

      logger.log({
        logger: "info",
        message: `[sockets.js]\tMessage Received from socket ${senderId}: ${message.body}`,
      });

      //TODO - Check if user is in the chat with chatID sent.

      models.Message.create({
        cBody: message.body,
        fkConversation: message.chatId,
        fkUser: senderId,
      })
        .then((message) =>
          models.Participant.findAll({
            where: {
              fkConversation: message.fkConversation,
            },
          })
        )
        .then((participants) => {
          if (participants.length == 2) {
            let destinationClientId = null;

            if (participants[0].fkUser == senderId) {
              destinationClientId = participants[1].fkUser;
            } else if (participants[1].fkUser == senderId) {
              destinationClientId = participants[0].fkUser;
            }

            if (destinationClientId) {
              const destinationSocketId =
                socketManager.getDestinationSocket(destinationClientId);

              if (destinationSocketId != undefined) {
                socket.broadcast.to(destinationSocketId).emit("new message", {
                  chatId: message.chatId,
                  body: message.body,
                  timestamp: message.timestamp, // TODO
                });
              }
            }
          }
        })
        .catch((err) =>
          logger.log({
            logger: "error",
            message: `[sockets.js]\tError adding new message with reason: ${err}`,
          })
        );
    });
  });

  return io;
};
