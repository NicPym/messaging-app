//getting all conversations of user
//checking if user email exists in
const chats = require("express").Router();
const { dataCleaner, formatDate } = require("../util/helpers");
const authenticate = require("../util/isAuth");
const { sequelize } = require("../models");
const models = sequelize.models;
const logger = require("../util/winston");

chats.get("/messages/:conversationId", authenticate, (req, res, next) => {
  if (isNaN(req.params.conversationId)) {
    let reason = new Error("'userId' not in correct data format");
    reason.status = 400;
    next(reason);
    return;
  }
  logger.log({
    logger: "info",
    message: `Fetching messages for user id [${req.token.id}]`,
  });
  models.Message.findAll({
    where: { fkConversation: Number(req.params.conversationId) },
    attributes: [
      ["cBody", "message"],
      ["createdAt", "messageTime"],
    ],
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
        ],
      },
    ],
  })
    .then((message) => {
      const { rows, meta } = dataCleaner(message);
      rows.forEach((ele) => {
        ele.messageTime = formatDate(ele.messageTime, "dateTime");
      });
      res.status(200).json({
        message: "Fetched Messages",
        success: true,
        data: rows,
        meta: meta,
      });
    })
    .catch((reason) => {
      if (!reason.statusCode) {
        reason.statusCode = 500;
      }
      next(reason);
    });
});

chats.get("/conversations/", authenticate, (req, res, next) => {
  logger.log({
    logger: "info",
    message: `Fetching conversations for user id [${req.token.id}]`,
  });

  models.Conversation.findAll({
    attributes: ["pkConversation"],
    include: [
      {
        model: models.User,
        through: models.Participant,
        where: { pkUser: req.token.id },
      },
    ],
  })
    .then((conversationID) => {
      const { rows } = dataCleaner(conversationID);

      return Promise.all([
        ...rows.map((ID) => {
          return models.Conversation.findAll({
            where: { pkConversation: Number(ID.pkConversation) },
            include: [
              {
                through: {
                  attributes: [["fkConversation", "ConversationID"]],
                },
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
                  ["pkUser", "userID"],
                ],
              },
            ],
          });
        }),
      ]);
    })
    .then((users) => {
      const { rows } = dataCleaner(users);
      rows.forEach((element) => {
        element.Users.forEach((ele) => {
          ele.currentUser = ele.userID === req.token.id;
        });
      });
      res.status(200).json({
        message: "Fetched Conversations",
        success: true,
        data: rows,
      });
    })
    .catch((reason) => {
      if (!reason.statusCode) {
        reason.statusCode = 500;
      }
      next(reason);
    });
});

chats.get("/test", (req, res, next) => {
  models.User.findAll({ where: { cEmail: "stuartb@bbd.co.za" } })
    .then((user) => {
      if (user.length === 1) {
        // Found user
        user = user[0];
        user.cFirstName = "Stuart";
        return user.save();
      } else {
        const user = {
          cFirstName: "Stuart",
          cLastName: "Barclay",
          cEmail: "stuartb@bbd.co.za",
        };

        return models.User.create(user);
      }
    })
    .then((e) => {
      const { rows } = dataCleaner(e);
      res.status(200).json({
        message: "Found/Created User",
        success: true,
        data: rows,
      });
    })
    .catch((reason) => {
      if (!reason.statusCode) {
        reason.statusCode = 500;
      }
      next(reason);
    });
});

module.exports = chats;
