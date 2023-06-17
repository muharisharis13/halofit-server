const { DataTypes } = require("sequelize");
const database = require("../../database");

const message = database.define(
  "message",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("responded", "ignored"),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);
message.sync({
  alter: false,
});
module.exports = message;
