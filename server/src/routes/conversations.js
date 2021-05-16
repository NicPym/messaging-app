//getting all conversations of user
//checking if user email exists in
const conversations = require("express").Router();
const { dataCleaner, formatDate } = require("../util/helpers");
const authenticate = require("../util/isAuth");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const models = sequelize.models;
const logger = require("../util/winston");

conversations.get(
  "/messages/:conversationId",
  authenticate,
  (req, res, next) => {
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
  }
);

conversations.get("/conversations/", authenticate, (req, res, next) => {
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
            messages: [],
          });
  
          messagesPromises.push(
            models.Message.findAll({
              where: { fkConversation: conversationIds[i] },
              attributes: [
                ["cBody", "body"],
                ["createdAt", "timestamp"],
                ["fkUser", "userID"],
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
  
            conversations[i].messages = rows.map((row) => {
              return {
                body: row.body,
                timestamp: formatDate(row.timestamp, "dateTime"),
                received: row.userID != req.token.id,
              };
            });
          }
        }
      }

      res.status(200).json({
        message: "Got all user conversations",
        success: true,
        data: conversations.filter(
          (conversation) => conversation.messages.length > 0
        ),
      });
    })
    .catch((reason) => {
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
      ],
    })
      .then((users) => {
        const { rows } = dataCleaner(users);

        if (users.length > 0 && rows[0].pkUser != req.token.id) {
          recipientName = rows[0].Name;
          recipientId = rows[0].pkUser;

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
          });
        } else {
          throw new Error("Invalid email address");
        }
      })
      .then((result) => {
        if (result.length > 0) throw new Error("Conversation already exists");

        return models.Conversation.create({});
      })
      .then((conversation) => {
        conversationId = conversation.pkConversation;

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
      })
      .then((results) => {
        res.status(200).json({
          message: "Created Conversation",
          success: true,
          data: {
            conversationId: conversationId,
            conversationWith: recipientName,
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

conversations.get("/test", (req, res, next) => {
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

module.exports = conversations;
