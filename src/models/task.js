const { DataTypes } = require("sequelize");
const database = require("../../database");
const merchantModel = require("./merchant");

const task = database.define(
  "task",
  {
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banner_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiredIn: {
      type: DataTypes.DATE,
    },
    poin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

merchantModel.hasMany(task, {
  foreignKey: "merchantId",
});

task.belongsTo(merchantModel);

module.exports = task;
