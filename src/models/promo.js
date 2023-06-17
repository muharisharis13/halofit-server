const { DataTypes } = require("sequelize");
const database = require("../../database");
const userPromoModel = require("./user_promo");
const merchantModel = require("./merchant");

const promo = database.define(
  "promo",
  {
    promo_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    point: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ExpiredIn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    promo_img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

promo.sync({
  alter: false,
});
promo.hasMany(userPromoModel, { foreignKey: "promoId" });

userPromoModel.belongsTo(promo);

merchantModel.hasMany(promo, {
  foreignKey: "merchantId",
});

promo.belongsTo(merchantModel);

module.exports = promo;
