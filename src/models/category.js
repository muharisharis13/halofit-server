const { DataTypes } = require("sequelize");
const database = require("../../database");

const category = database.define(
  "category",
  {
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

category.sync({
  alter: false,
});

module.exports = category;
