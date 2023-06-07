const { DataTypes } = require("sequelize");
const database = require("../../database");
const merchantModel = require("./merchant");
const categoryModel = require("./category");

const facility = database.define(
  "facility",
  {
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    facility_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banner_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    uom: {
      type: DataTypes.ENUM("jam"),
      allowNull: false,
      defaultValue: "jam",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

facility.sync({
  alter: false,
});

merchantModel.hasMany(facility, {
  foreignKey: "merchantId",
});

categoryModel.hasMany(facility, {
  foreignKey: "categoryId",
});

facility.belongsTo(categoryModel);
facility.belongsTo(merchantModel);

module.exports = facility;
