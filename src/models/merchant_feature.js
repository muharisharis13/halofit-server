const { DataTypes } = require("sequelize");
const database = require("../../database");
const merchantModel = require("./merchant");
const featureModel = require("./feature");

const merchantFeature = database.define(
  "merchant_feature",
  {
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    featureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

merchantModel.hasMany(merchantFeature, {
  foreignKey: "merchantId",
});

featureModel.hasMany(merchantFeature, {
  foreignKey: "featureId",
});

merchantFeature.belongsTo(merchantModel);
merchantFeature.belongsTo(featureModel);

module.exports = merchantFeature;
