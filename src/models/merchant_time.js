const { DataTypes } = require("sequelize");
const database = require("../../database");
const merchantModel = require("./merchant");

const mertchantTime = database.define(
  "merchant_time",
  {
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    sunday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tuesday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wednesday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thursday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    friday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    saturday: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

mertchantTime.sync({
  alter: false,
});

merchantModel.hasMany(mertchantTime, {
  foreignKey: "merchantId",
});

mertchantTime.belongsTo(merchantModel);

module.exports = mertchantTime;
