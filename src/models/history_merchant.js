const { DataTypes } = require("sequelize");
const database = require("../../database");

const history_merchant = database.define(
  "history_merchant",
  {
    merchantId: {
      type: DataTypes.INTEGER,
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

history_merchant.sync({
  alter: true,
});

module.exports = history_merchant;
