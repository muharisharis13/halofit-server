const { DataTypes } = require("sequelize");
const database = require("../../database");
const roomModel = require("./room");

const roomDetail = database.define(
  "room_detail",
  {
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

module.exports = roomDetail;
