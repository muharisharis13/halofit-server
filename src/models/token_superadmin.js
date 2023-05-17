const { DataTypes } = require("sequelize");
const database = require("../../database");

const token = database.define(
  "token_superadmin",
  {
    SuperAdminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

token.sync({
  alter: false,
});

module.exports = token;
