const { DataTypes } = require("sequelize");
const database = require("../../database");
const userModel = require("../models/user");

const history_user = database.define(
  "history_user",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("meetup", "reserve", "payment"),
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nominal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

history_user.sync({
  alter: true,
});

userModel.hasMany(history_user, {
  foreignKey: "userId",
});

history_user.belongsTo(userModel);

module.exports = history_user;
