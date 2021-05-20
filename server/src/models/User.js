"use strict";

const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Conversation, {
        foreignKey: "fkUser",
        through: models.Participant,
      });
      this.hasMany(models.Message, {
        foreignKey: "fkUser",
        targetKey: "pkUser",
      });
    }
  }
  User.init(
    {
      pkUser: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      cFirstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cLastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cProfilePicURL: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
