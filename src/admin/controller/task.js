const { Op } = require("sequelize");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const taskMoodel = require("../../models/task");
const taskDetailMoodel = require("../../models/task_detail");

class controllerTask {
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
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
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
