const { DataTypes } = require("sequelize");
const database = require("../../database");

const TaskDetail = database.define(
  "task_detail",
  {
    taskId: {
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

module.exports = TaskDetail;
