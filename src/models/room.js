// room
// id (int) PK
// room_name
// facilityId
// gender (string)
// range_age (string)
// max_capacity
// room_desc
// userId
// desc
// room_expired

const { DataTypes } = require("sequelize");
const database = require("../../database");
const facilityModel = require("./facility");
const userModel = require("./user");
const bookingModel = require("./booking");

const room = database.define(
  "room",
  {
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    room_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facilityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    range_age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    room_desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    room_expired: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status_room: {
      type: DataTypes.ENUM("waiting", "playing"),
      defaultValue: "waiting"
    }
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

room.sync({
  alter: false,
});

facilityModel.hasMany(room, {
  foreignKey: "facilityId",
});
room.belongsTo(facilityModel);

userModel.hasMany(room, {
  foreignKey: "userId",
});

room.belongsTo(userModel);

bookingModel.hasMany(room, {
  foreignKey: "bookingId",
});

room.belongsTo(bookingModel);

module.exports = room;
