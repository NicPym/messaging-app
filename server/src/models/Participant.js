"use strict";

const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
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
  Participant.init(
    {
      pkParticipant: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
    },
    {
      sequelize,
      modelName: "Participant",
    }
  );
  return Participant;
};
