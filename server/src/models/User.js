"use strict";

const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      /**
       * Belong Association, fk on this
       */

      /**
       * Has Association, fk on other
       */

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
      createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.fn("NOW") },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
