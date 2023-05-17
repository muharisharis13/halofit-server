const { DataTypes } = require("sequelize");
const database = require("../../database");

const SuperAdmin = database.define(
  "Super_Admin",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

SuperAdmin.sync({
  alter: false,
});

module.exports = SuperAdmin;
