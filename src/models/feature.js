const { DataTypes } = require("sequelize");
const database = require("../../database");

const feature = database.define(
  "feature",
  {
    feature_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

feature.sync({
  alter: false,
});

module.exports = feature;
