const { Op } = require("sequelize");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const taskMoodel = require("../../models/task");
const taskDetailMoodel = require("../../models/task_detail");
const userModel = require("../../models/user");
const userTaskMode = require("../../models/user_task");

class controllerTask {
  async updateDetailTaskUser(req, res) {
    const { userId } = req.params;
    const { taskDetailId } = req.body;
    try {
      let findUserTask = await userTaskMode.findOne({
        where: {
          userId,
        },
      });

      let arrTaskDetailId = findUserTask?.dataValues?.taskDetailId?.split(",");

      if (arrTaskDetailId?.includes(JSON.stringify(taskDetailId))) {
        arrTaskDetailId?.filter(
          (filter) => filter != JSON.stringify(taskDetailId)
        );

        let newArrDetailId = arrTaskDetailId?.filter(
          (filter) => filter != JSON.stringify(taskDetailId)
        );

        findUserTask.update({
          taskDetailId: newArrDetailId?.join(","),
        });
        responseJSON({
          res,
          status: 200,
          data: findUserTask,
        });
      } else {
        let newArrDetailId = [...arrTaskDetailId, taskDetailId];
        const getDetailTask = await taskDetailMoodel.findAll({});

        const isComplete = getDetailTask
          .filter(
            (filter) =>
              filter.dataValues?.taskId == findUserTask?.dataValues?.taskId
          )
          .map((item) =>
            newArrDetailId
              ?.filter((filter) => filter != "")
              ?.map((item) => parseInt(item))
              ?.includes(parseInt(item.dataValues.id))
              ? true
              : false
          );
        console.log(
          "newArrDetailId",
          newArrDetailId?.filter((filter) => filter != "")
        );
        console.log({ isComplete });
        findUserTask.update({
          taskDetailId: newArrDetailId?.join(","),
          status: isComplete.every((val) => val === true)
            ? "selesai"
            : "berjalan",
        });

        responseJSON({
          res,
          status: 200,
          data: findUserTask,
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
  async getDetailTaskUser(req, res) {
    const { userId } = req.params;
    try {
      let getUserTask = await userTaskMode.findOne({
        where: {
          userId,
        },
        include: [
          {
            model: userModel,
          },
        ],
      });
      const getDetailTask = await taskDetailMoodel.findAll({
        raw: true,
      });

      getUserTask = {
        ...getUserTask.dataValues,
        list_task: getDetailTask.filter(
          (filter) => filter.taskId == getUserTask.dataValues?.taskId
        ),
      };

      responseJSON({
        res,
        status: 200,
        data: getUserTask,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
  async getListTaskUser(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "task_name",
      query = "",
    } = req.query;
    const { merchantId } = req.params;
    const { limit, offset } = getPagination(page, size);
    try {
      let getListDetailTask = await taskDetailMoodel.findAll({
        where: {
          merchantId,
        },
      });

      let getListUser = await userModel.findAndCountAll({
        attributes: {
          exclude: ["password", "pin", "balance", "status"],
        },
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const getUserTask = await userTaskMode.findAll();

      getListDetailTask = getListDetailTask.map((item) => ({
        ...item.dataValues,
        list_user: item.dataValues?.list_user
          ? JSON.parse(item.dataValues.list_user)
          : [],
      }));

      getListUser = {
        ...getListUser,
        rows: getListUser.rows.map((item) => ({
          ...item.dataValues,
          task:
            getUserTask.find(
              (filter) => filter.dataValues.userId == item.dataValues.id
            ) || null,
        })),
      };

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getListUser, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
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

      let newList_task = JSON.parse(list_task);

      console.log({ list_task });

      if (newList_task.length > 0) {
        newList_task?.map(async (item) => {
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
          banner_img: req.file?.filename || null,
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
    const { taskId } = req.params;
    try {
      const getDetailTask = await taskMoodel.findOne({
        where: {
          id: taskId,
        },
      });

      if (!getDetailTask) {
        responseJSON({
          res,
          status: 200,
          data: "Task Not Found !",
        });
      } else {
        const getListTask = await taskDetailMoodel.findAll({
          where: {
            taskId: taskId,
          },
        });

        responseJSON({
          res,
          status: 200,
          data: {
            ...getDetailTask?.dataValues,
            list_task: getListTask,
          },
        });
      }
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

    console.log({ list_task });

    let newList_task = JSON.parse(list_task);
    try {
      if (!req.file) {
        responseJSON({
          res,
          status: 400,
          data: "File Must be Upload !",
        });
      }

      const result = await taskMoodel.create({
        merchantId,
        task_name,
        expiredIn,
        poin,
        banner_img: req.file.filename,
      });

      const id = result.id;

      newList_task.map(async (item) => {
        await taskDetailMoodel.create({
          merchantId,
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
          list_task: newList_task,
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
}

module.exports = new controllerTask();
