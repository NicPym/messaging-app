"use strict";

const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        foreignKey: "fkConversation",
        through: models.Participant,
      });
      this.hasMany(models.Message, {
        foreignKey: "fkConversation",
        targetKey: "pkConversation",
      });
    }
  }
  Conversation.init(
    {
      pkConversation: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      iMessageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
