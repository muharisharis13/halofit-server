const { Op } = require("sequelize");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const taskMoodel = require("../../models/task");
const taskDetailMoodel = require("../../models/task_detail");

class controllerTask {
  async deleteTask(req, res) {
    const { taskId, merchantId } = req.body;
    try {
      const deleteTask = await taskMoodel.destroy({
        where: {
          id: taskId,
          merchantId,
        },
      });
      const deleteDetailTask = await taskDetailMoodel.destroy({
        where: {
          taskId,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: {
          task_info: deleteTask,
          task_detail: deleteDetailTask,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
  async updateTask(req, res) {
    const { merchantId } = req.params;
    const { taskId, task_name, expiredIn, list_task = [], poin } = req.body;
    try {
      const getDetailTask = await taskMoodel.findOne({
        where: {
          id: taskId,
          merchantId,
        },
      });

      if (list_task.length > 0) {
        list_task?.map(async (item) => {
          await taskDetailMoodel
            .findOne({
              where: {
                id: item.taskDetailId,
              },
            })
            .then(async (responseTask) => {
              responseTask.update({
                task_name: item?.task_name,
              });
            });
        });
      }

      if (getDetailTask) {
        getDetailTask.update({
          task_name,
          expiredIn,
          poin,
        });
      }

      const getDetailTaskList = await taskDetailMoodel.findAll({
        where: {
          taskId: taskId,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: {
          ...getDetailTask.dataValues,
          list_task: getDetailTaskList,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
  async detailTask(req, res) {
    const { merchantId } = req.params;
    try {
      const getDetailTask = await taskMoodel.findOne({
        where: {
          merchantId,
        },
      });

      const getListTask = await taskDetailMoodel.findAll({
        where: {
          taskId: getDetailTask.id,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: {
          ...getDetailTask.dataValues,
          list_task: getListTask,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
  async setUserToDetailTask(req, res) {
    const { merchantId } = req.params;
    const { userId, task_detail_id, taskId } = req.body;
    try {
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
    const { merchantId } = req.params;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
      merchantId: merchantId,
    };
    try {
      const getTask = await taskMoodel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getTask, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async createTask(req, res) {
    const { merchantId, task_name, expiredIn, list_task = [], poin } = req.body;
    try {
      const result = await taskMoodel.create({
        merchantId,
        task_name,
        expiredIn,
        poin,
      });

      const id = result.id;

      list_task.map(async (item) => {
        await taskDetailMoodel.create({
          taskId: id,
          task_name: item.task_name,
          task_desc: item.task_desc || "",
        });
      });

      const getTaskDetail = await taskDetailMoodel.findAll({
        where: {
          taskId: result.dataValues.id,
        },
        raw: true,
      });

      responseJSON({
        res,
        status: 200,
        data: {
          task_info: result.dataValues,
          list_task: list_task,
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
}

module.exports = new controllerTask();
