"use strict";

const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      /**
       * Belong Association
       */

      this.belongsTo(models.Province, {
        foreignKey: "fkProvince",
        targetKey: "pkProvince",
      });

      this.belongsToMany(models.User, {
        foreignKey: "fkUser",
        targetKey: "pkUser",
        through: models.Participant,
      });

      /**
       * Has Association
       */

      this.hasMany(models.Message, {
        foreignKey: "fkConversation",
        targetKey: "pkConversation",
      });

      this.belongsToMany(models.User, {
        foreignKey: "fkUser",
        targetKey: "pkUser",
        through: models.Participant,
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
      createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
