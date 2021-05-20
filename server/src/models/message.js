"use strict";

const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "fkUser",
        targetKey: "pkUser",
      });
      this.belongsTo(models.Conversation, {
        foreignKey: "fkConversation",
        targetKey: "pkConversation",
      });
    }
  }
  Message.init(
    {
      pkMessage: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      cBody: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
