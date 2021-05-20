const logger = require("../util/winston");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/constants");
const socketManager = require("../util/socketManager");
const { sequelize } = require("../models");
const { dataCleaner, formatDate } = require("../util/helpers");
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
      message: `[sockets.js]\tNew client with id ${socketManager.getSocketClientId(
        socket.id
      )} connected using websocket`,
    });

    socket.on("disconnect", () => {
      logger.log({
        logger: "info",
        message: `[sockets.js]\tClient with id ${socketManager.getSocketClientId(
          socket.id
        )} disconnected from websocket`,
      });

      socketManager.deleteSocket(socket.id);
    });

    socket.on("send message", (message) => {
      const senderId = socketManager.getSocketClientId(socket.id);
      let destinationUserID;
      let senderUserName;
      let senderProfilePicURL;
      let messageTimestamp;

      logger.log({
        logger: "info",
        message: `[sockets.js]\tMessage Received from user with ID - ${senderId}: ${message.body}`,
      });

      models.Participant.findAll({
        where: {
          fkConversation: message.conversationId,
        },
        include: [
          {
            model: models.User,
            attributes: [
              [
                sequelize.fn(
                  "concat",
                  sequelize.col("cFirstName"),
                  " ",
                  sequelize.col("cLastName")
                ),
                "Name",
              ],
              "cProfilePicURL",
            ],
          },
        ],
      })
        .then((participants) => {
          if (participants.length > 0) {
            const { rows } = dataCleaner(participants);

            if (rows[0].fkUser == senderId) {
              destinationUserID = rows[1].fkUser;
              senderUserName = rows[0].Name;
              senderProfilePicURL = rows[0].cProfilePicURL;
            } else if (rows[1].fkUser == senderId) {
              destinationUserID = rows[0].fkUser;
              senderUserName = rows[1].Name;
              senderProfilePicURL = rows[1].cProfilePicURL;
            } else {
              throw new Error(
                `User with ID ${senderId} is not in the conversation with ID ${message.conversationId}`
              );
            }

            return models.Message.create({
              cBody: message.body,
              fkConversation: message.conversationId,
              fkUser: senderId,
            });
          } else {
            throw new Error(
              `Conversation ID ${message.conversationId} does not exist.`
            );
          }
        })
        .then((message) => {
          messageTimestamp = new Date();
          return models.Conversation.increment("iMessageCount", {
            by: 1,
            where: { pkConversation: message.fkConversation },
          });
        })
        .then((update) => {
          return models.Conversation.findAll({
            where: { pkConversation: message.conversationId },
          });
        })
        .then((conversations) => {
          const { rows } = dataCleaner(conversations);

          const destinationSocketId =
            socketManager.getDestinationSocket(destinationUserID);

          if (destinationSocketId) {
            logger.log({
              logger: "info",
              message: `[sockets.js]\tSending message to user with id - ${destinationUserID}: ${message.body}`,
            });

            if (rows[0].iMessageCount > 1) {
              socket.broadcast.to(destinationSocketId).emit("new message", {
                conversationId: message.conversationId,
                body: message.body,
                timestamp: messageTimestamp,
                received: true,
              });
            } else {
              socket.broadcast
                .to(destinationSocketId)
                .emit("new conversation", {
                  conversationId: message.conversationId,
                  conversationWith: senderUserName,
                  conversationWithProfilePicURL: senderProfilePicURL,
                  unreadMessages: 1,
                  messages: [
                    {
                      body: message.body,
                      timestamp: messageTimestamp,
                      received: true,
                    },
                  ],
                });
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
