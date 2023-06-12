const taskModel = require("../../models/task");
const taskDetailModel = require("../../models/task_detail");
const { Op } = require("sequelize");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const merchantModel = require("../../models/merchant");
const moment = require("moment");
const taskUserModel = require("../../models/user_task");

const diffDays = (date1, date2) => {
  return parseInt(
    (new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24),
    10
  );
};

class controllerTask {
  async getTaskDetail(req, res) {
    const { taskId } = req.params;
    try {
      const resultTask = await taskModel.findOne({
        where: {
          id: taskId,
        },
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: ["id", "email", "merchant_name", "address"],
          },
        ],
      });

      const resultTaskDetail = await taskDetailModel.findAll({
        where: {
          taskId,
        },
        raw: true,
      });

      responseJSON({
        res,
        status: 200,
        data: {
          task_info: resultTask,
          task_detail: resultTaskDetail.map((item) => ({
            ...item,
            list_user: JSON.parse(item.list_user) || [],
          })),
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async getDetailTaskProgress(req, res) {
    const { userId, taskId } = req.params;
    try {
      let getOneUserTask = await taskUserModel.findOne({
        where: {
          userId,
          taskId,
        },
        include: [
          {
            model: taskModel,
            as: "task",
            include: [
              {
                model: merchantModel,
                as: "merchant",
              },
            ],
          },
        ],
      });

      if (getOneUserTask) {
        const taskDetail = await taskDetailModel.findAll({
          where: {
            taskId,
          },
        });

        const taskDetailId = () => {
          return getOneUserTask.dataValues?.taskDetailId
            ?.split(",")
            ?.filter((filter) => filter != "");
        };

        const filterTaskDetail = () => {
          return taskDetail.filter(
            (filter) =>
              filter.dataValues?.taskId == getOneUserTask.dataValues.taskId
          );
        };

        const currentPoin = () => {
          return (
            (taskDetailId()?.length / filterTaskDetail()?.length) *
            getOneUserTask.dataValues?.task?.poin
          );
        };

        getOneUserTask = {
          ...getOneUserTask.dataValues,
          taskDetailId: taskDetailId(),
          task_detail: taskDetail.map((item) => ({
            ...item?.dataValues,
            status: taskDetailId()?.every((val) => val == item.dataValues?.id),
          })),
          currentPoin: currentPoin(),
        };

        responseJSON({
          res,
          status: 200,
          data: getOneUserTask,
        });
      } else {
        responseJSON({
          res,
          status: 404,
          data: "User task not found",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }

  async doTask(req, res) {
    const { taskId, userId, status = "berjalan", taskDetailId } = req.body;
    try {
      let result = await taskUserModel.create({
        taskId,
        userId,
        status,
        taskDetailId,
      });
      if (result) {
        responseJSON({
          res,
          status: 200,
          data: result,
        });
      } else {
        responseJSON({
          res,
          status: 401,
          data: "gagal jalankan task",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }

  async getListTaskOnProgress2(req, res) {
    const { userId } = req.params;
    try {
      let getTaskUser = await taskUserModel.findAll({
        where: {
          userId,
          status: "berjalan",
        },
        include: [
          {
            model: taskModel,
            include: [
              {
                model: merchantModel,
                as: "merchant",
              },
            ],
          },
        ],
      });

      let taskDetail = await taskDetailModel.findAll();

      const filterTaskDetail = (item) => {
        return taskDetail.filter(
          (filter) => filter.dataValues.taskId == item.dataValues.taskId
        );
      };

      const taskDetailId = (item) => {
        return item.dataValues?.taskDetailId
          ?.split(",")
          ?.filter((filter) => filter != "");
      };

      const currentPoin = (item) => {
        return (
          (taskDetailId(item)?.length / filterTaskDetail(item)?.length) *
          item.dataValues?.task?.poin
        );
      };

      const percentage = (item) => {
        return (
          (taskDetailId(item)?.length / filterTaskDetail(item)?.length) * 100
        );
      };

      getTaskUser = getTaskUser.map((item) => ({
        ...item.dataValues,
        task_detail: filterTaskDetail(item),
        taskDetailId: taskDetailId(item),
        current_poin: currentPoin(item),
        percentage: percentage(item),
        expiredInDays: diffDays(
          moment(new Date()).format("YYYY-MM-DD"),
          moment(new Date(item.dataValues.task.expiredIn)).format("YYYY-MM-DD")
        ),
      }));

      responseJSON({
        res,
        status: 200,
        data: getTaskUser,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
  async getListTaskOnProgress(req, res) {
    const { userId } = req.params;
    try {
      const getListTask = await taskModel.findAll({
        raw: true,
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "balance"],
            },
          },
        ],
      });
      const getTaskDetail = await taskDetailModel.findAll({
        raw: true,
      });

      const newTaskDetail = getTaskDetail.map((item) => ({
        ...item,
        list_user: JSON.parse(item.list_user),
      }));

      const newUserId = [userId];

      const newTaskDetailWithFilter = newTaskDetail.filter(
        (d) =>
          d.list_user?.every((c) => newUserId.includes(c)) ||
          d.list_user !== null
      );

      const combineTask = getListTask
        .map((item) => ({
          ...item,
          total_task: newTaskDetail.filter(
            (filter) => filter.taskId === item.id
          ).length,
          list_task: newTaskDetailWithFilter.filter(
            (filter) => filter.taskId === item.id
          ),
          percentage:
            (newTaskDetailWithFilter.filter(
              (filter) => filter.taskId === item.id
            ).length *
              100) /
            newTaskDetail.filter((filter) => filter.taskId === item.id).length,
        }))
        .filter((filter) => filter.percentage !== 0)
        .map((item) => ({
          ...item,
          expiredInDays: diffDays(
            moment(new Date()).format("YYYY-MM-DD"),
            moment(new Date(item.expiredIn)).format("YYYY-MM-DD")
          ),
          merchant: {
            id: item["merchant.id"],
            email: item["merchant.email"],
            address: item["merchant.address"],
            merchant_name: item["merchant.merchant_name"],
            desc: item["merchant.desc"],
          },
        }));

      responseJSON({
        res,
        status: 200,
        data: combineTask,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }

  async getListTask(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "task_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
    };
    try {
      const getListTask = await taskModel.findAndCountAll({
        where: condition,
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "password",
                "desc",
                "balance",
              ],
            },
          },
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const getDetailTask = await taskDetailModel.findAll();

      const newData = {
        count: getListTask.count,
        rows: getListTask.rows.map((item) => ({
          ...item.dataValues,
          list_task: getDetailTask.filter(
            (filter) => filter.taskId == item.dataValues.id
          ),
        })),
      };

      responseJSON({
        res,
        status: 200,
        data: getPagingData(newData, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
}

module.exports = new controllerTask();
