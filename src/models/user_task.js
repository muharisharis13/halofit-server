const { DataTypes } = require("sequelize");
const database = require("../../database");
const userModel = require("./user");
const taskModel = require("./task");

const userTask = database.define(
  "user_task",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskDetailId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("berjalan", "selesai"),
      defaultValue: "berjalan",
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

userTask.sync({
  alter: false,
});

taskModel.hasMany(userTask, {
  foreignKey: "taskId",
});

userTask.belongsTo(taskModel);
userModel.hasMany(userTask, {
  foreignKey: "userId",
});

userTask.belongsTo(userModel);

module.exports = userTask;
