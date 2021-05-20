//getting all conversations of user
//checking if user email exists in
const conversations = require("express").Router();
const { dataCleaner, formatDate } = require("../util/helpers");
const authenticate = require("../util/isAuth");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const models = sequelize.models;
const logger = require("../util/winston");

conversations.get("/getConversations/", authenticate, (req, res, next) => {
  let conversationIds = [];
  let conversations = [];

  models.Participant.findAll({
    where: { fkUser: req.token.id },
    attributes: ["fkConversation"],
  })
    .then((conversationIDs) => {
      if (conversationIDs.length > 0) {
        const { rows } = dataCleaner(conversationIDs);
        let participantsPromises = [];

        rows.forEach((row) => {
          conversationIds.push(row.fkConversation);
          participantsPromises.push(
            models.Participant.findAll({
              attributes: [],
              where: {
                fkConversation: row.fkConversation,
                fkUser: {
                  [Op.ne]: [req.token.id],
                },
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
          );
        });

        return Promise.all(participantsPromises);
      }
    })
    .then((values) => {
      if (values) {
        let messagesPromises = [];

        for (let i = 0; i < values.length; i++) {
          const { rows } = dataCleaner(values[i]);

          conversations.push({
            conversationId: conversationIds[i],
            conversationWith: rows[0].Name,
            conversationWithProfilePicURL: rows[0].cProfilePicURL,
            unreadMessages: 0,
            messages: [],
          });

          messagesPromises.push(
            models.Message.findAll({
              where: { fkConversation: conversationIds[i] },
              attributes: [
                ["cBody", "body"],
                ["createdAt", "timestamp"],
                ["fkUser", "userID"],
                ["bRead", "read"],
              ],
            })
          );
        }

        return Promise.all(messagesPromises);
      }
    })
    .then((values) => {
      if (values) {
        for (let i = 0; i < values.length; i++) {
          if (values[i].length > 0) {
            const { rows } = dataCleaner(values[i]);

            for (let j = 0; j < rows.length; j++) {
              if (rows[j].userID != req.token.id && !rows[j].read)
                conversations[i].unreadMessages++;

              conversations[i].messages.push({
                body: rows[j].body,
                timestamp: rows[j].timestamp,
                received: rows[j].userID != req.token.id,
              });
            }
          }
        }
      }

      logger.log({
        logger: "info",
        message: `[conversations.js]\tGot all conversations for ${req.token.id}`,
      });

      res.status(200).json({
        message: "Got all user conversations",
        success: true,
        data: conversations.filter(
          (conversation) => conversation.messages.length > 0
        ),
      });
    })
    .catch((reason) => {
      logger.log({
        logger: "error",
        message: `[conversations.js]\tFailed to get all conversations for ${req.token.id}`,
      });

      if (!reason.statusCode) {
        reason.statusCode = 500;
      }
      next(reason);
    });
});

conversations.post(
  "/createConversation/:recipientEmail",
  authenticate,
  (req, res, next) => {
    let conversationId;
    let recipientId;
    let recipientName;
    let recipientProfilePicURL;

    models.User.findAll({
      where: { cEmail: req.params.recipientEmail },
      attributes: [
        "pkUser",
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
    })
      .then((users) => {
        const { rows } = dataCleaner(users);

        if (users.length > 0 && rows[0].pkUser != req.token.id) {
          recipientName = rows[0].Name;
          recipientId = rows[0].pkUser;
          recipientProfilePicURL = rows[0].cProfilePicURL;

          return models.Participant.findAll({
            attributes: [
              "fkConversation",
              [sequelize.fn("COUNT", "fkConversation"), "Count"],
            ],
            where: {
              fkUser: {
                [Op.or]: [rows[0].pkUser, req.token.id],
              },
            },
            group: "fkConversation",
            having: {
              Count: {
                [Op.gt]: 1,
              },
            },
            include: [
              {
                model: models.Conversation,
                attributes: ["iMessageCount"],
              },
            ],
          });
        } else {
          throw new Error("Invalid email address");
        }
      })
      .then((result) => {
        const { rows } = dataCleaner(result);

        if (result.length > 0 && rows[0].iMessageCount == 0)
          return models.Conversation.findByPk(rows[0].fkConversation);
        else if (result.length > 0)
          throw new Error("Conversation already exists");

        return models.Conversation.create({});
      })
      .then((conversation) => {
        conversationId = conversation.pkConversation;

        if (conversation._options.isNewRecord) {
          return Promise.all([
            models.Participant.create({
              fkConversation: conversationId,
              fkUser: req.token.id,
            }),
            models.Participant.create({
              fkConversation: conversationId,
              fkUser: recipientId,
            }),
          ]);
        }
      })
      .then((_) => {
        logger.log({
          logger: "info",
          message: `[conversations.js]\tCreated Conversation for ${req.user.id}`,
        });

        res.status(200).json({
          message: "Created Conversation",
          success: true,
          data: {
            conversationId: conversationId,
            conversationWith: recipientName,
            conversationWithProfilePicURL: recipientProfilePicURL,
            unreadMessages: 0,
            messages: [],
          },
        });
      })
      .catch((reason) => {
        if (!reason.statusCode) {
          reason.statusCode = 500;
        }
        next(reason);
      });
  }
);

conversations.post(
  "/readAllMessages/:conversationId",
  authenticate,
  (req, res, next) => {
    models.Participant.findAll({
      where: {
        fkConversation: req.params.conversationId,
      },
    })
      .then((participants) => {
        if (participants.length == 2) {
          if (
            participants[0].fkUser != req.token.id &&
            participants[1].fkUser != req.token.id
          )
            throw new Error("User not in the conversation");

          models.Message.update(
            {
              bRead: true,
            },
            {
              where: {
                fkConversation: req.params.conversationId,
                fkUser:
                  participants[0].fkUser == req.token.id
                    ? participants[1].fkUser
                    : participants[0].fkUser,
              },
            }
          );
        } else {
          throw new Error("Invalid Conversation ID");
        }
      })
      .then((updates) => {
        logger.log({
          logger: "info",
          message: `[conversations.js]\tMessages updated to read for conversation ${req.params.conversationId} for user ${req.token.id}`,
        });

        res.status(200).json({
          message: "Updated all messages to read",
          success: true,
        });
      })
      .catch((reason) => {
        logger.log({
          logger: "error",
          message: `[conversations.js]\tFailed to update messages to read for ${req.token.id}`,
        });

        if (!reason.statusCode) {
          reason.statusCode = 500;
        }
        next(reason);
      });
  }
);

module.exports = conversations;
