const { DataTypes } = require("sequelize");
const database = require("../../database");
const userModel = require("./user");

const user_promo = database.define(
  "user_promo",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    promoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_promo: {
      type: DataTypes.ENUM("Sudah Digunakan", "Belum Digunakan"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

user_promo.sync({
  alter: false,
});

userModel.hasMany(user_promo, { foreignKey: "userId" });
user_promo.belongsTo(userModel);

module.exports = user_promo;
