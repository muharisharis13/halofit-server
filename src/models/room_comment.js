const { DataTypes } = require("sequelize");
const database = require("../../database");

const roomComment = database.define(
  "room_comment",
  {
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

roomComment.sync({
  alter: false,
});

module.exports = roomComment;
