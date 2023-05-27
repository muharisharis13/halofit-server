const { DataTypes } = require("sequelize");
const database = require("../../database");

const banner = database.define(
  "banner",
  {
    banner_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = banner;
