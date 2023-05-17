const { DataTypes } = require("sequelize");
const database = require("../../database");

const message = database.define(
  "message",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
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
