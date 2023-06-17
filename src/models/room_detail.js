const { DataTypes } = require("sequelize");
const database = require("../../database");
const roomModel = require("./room");
const userModel = require("./user");

const roomDetail = database.define(
  "room_detail",
  {
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_approved: {
      type: DataTypes.ENUM("approved", "reject", "unapproved"),
      defaultValue: "unapproved",
    },
    payment_user: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

roomDetail.sync({
  alter: false,
});

roomModel.hasMany(roomDetail, {
  foreignKey: "roomId",
});

roomDetail.belongsTo(roomModel);

userModel.hasMany(roomDetail, {
  foreignKey: "userId",
});

roomDetail.belongsTo(userModel);

module.exports = roomDetail;
