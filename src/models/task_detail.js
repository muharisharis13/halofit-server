const { DataTypes } = require("sequelize");
const database = require("../../database");
const taskModel = require("./task");

const TaskDetail = database.define(
  "task_detail",
  {
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task_desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    list_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

TaskDetail.sync({
  alter: true,
});

taskModel.hasMany(TaskDetail, {
  foreignKey: "taskId",
});

TaskDetail.belongsTo(taskModel);

module.exports = TaskDetail;
