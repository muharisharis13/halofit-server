const { DataTypes } = require("sequelize");
const database = require("../../database");
const roomModel = require("./room");
const userModel = require("./user");

const notifcation_join_room = database.define(
  "notification_join_room",
  {
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roomDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_notif: {
      type: DataTypes.ENUM("request", "info"),
      defaultValue: "request",
    },
    show: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

notifcation_join_room.sync({
  alter: false,
});

roomModel.hasMany(notifcation_join_room, {
  foreignKey: "roomId",
});
userModel.hasMany(notifcation_join_room, {
  foreignKey: "userId",
});

notifcation_join_room.belongsTo(roomModel);
notifcation_join_room.belongsTo(userModel);
module.exports = notifcation_join_room;
