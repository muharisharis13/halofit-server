const { DataTypes } = require("sequelize");
const database = require("../../database");

const user = database.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

user.sync({
  alter: false,
});

module.exports = user;
