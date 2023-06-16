const { Op } = require("sequelize");
const { general, paging, url } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const taskMoodel = require("../../models/task");
const taskDetailMoodel = require("../../models/task_detail");
const userModel = require("../../models/user");
const userTaskMode = require("../../models/user_task");
const { fullURL } = url;
const { pathBannerTask } = require("../../../utils/url");

class controllerTask {
  async updateDetailTaskUser2(req, res) {
    const { taskUserId } = req.params;
    let { taskDetailId } = req.body;
    try {
      const getUserTask = await userTaskMode.findOne({
        where: {
          id: taskUserId,
        },
      });

      if (getUserTask) {
        // di parse ke dari string ke JSON
        // let taskDetailId = JSON.parse(getUserTask?.dataValues?.taskDetailId);
        let taskDetailIdUser =
          getUserTask?.dataValues?.taskDetailId?.split(",") || [];
        console.log("length", taskDetailIdUser.length);
        //jika task detail dari user tidak ada maka buat baru untuk nambahkan task id nya
        if (!taskDetailIdUser || taskDetailIdUser.length < 3) {
          taskDetailId = JSON.parse(taskDetailId);
          taskDetailIdUser.push(taskDetailId);

          getUserTask.update({
            taskDetailId: taskDetailIdUser
              .filter(
                (value, index) => taskDetailIdUser.indexOf(value) === index
              )
              .join(","),
          });

          responseJSON({
            res,
            status: 200,
            data: "Berhasil",
          });

          return;
        }

        console.log("jalan");

        taskDetailId = JSON.parse(taskDetailId);
        taskDetailIdUser = [...new Set(taskDetailId)];

        //jika task di kerjakan semua
        let getTaskDetail = await taskDetailMoodel.findAll({
          where: {
            taskId: getUserTask?.dataValues?.taskId,
          },
        });

        let task = await taskMoodel.findOne({
          where: {
            id: getUserTask?.dataValues?.taskId,
          },
        });

        let isComplete = getTaskDetail
          .map((item) => item.dataValues)
          .every((every) =>
            taskDetailIdUser
              .map((item) => parseInt(item))
              .includes(parseInt(every.id))
          );

        console.log({ isComplete });

        if (isComplete && getUserTask.dataValues?.status == "berjalan") {
          console.log("masuk");
          getUserTask.update({
            taskDetailId: taskDetailIdUser.join(","),
            status: isComplete ? "selesai" : "berjalan",
          });
          const findUser = await userModel.findOne({
            where: {
              id: userId,
            },
          });

          if (!findUser) throw Error("User Tidak Ditemukan");

          findUser.update({
            point:
              parseInt(findUser?.dataValues?.point) +
              parseInt(task?.dataValues.poin),
          });
        }

        responseJSON({
          res,
          status: 200,
          data: taskDetailId,
        });
      } else {
        throw Error("User Tidak ditemukan");
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
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
        console.log("masuk ada");
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
        console.log("masuk gak ada");
        let newArrDetailId = [taskDetailId];
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
  async getDetailTaskUser2(req, res) {
    const { userId, taskUserId, taskId } = req.params;
    try {
      let getTaskUser = await userTaskMode.findOne({
        where: {
          taskId,
          id: taskUserId,
          userId,
        },
      });

      const getUser = await userModel.findOne({
        where: {
          id: userId,
        },
      });

      const getDetailTask = await taskDetailMoodel.findAll({
        where: {
          taskId,
        },
      });

      if (!getTaskUser) throw Error("Task User Tidak Ditemukan");

      getTaskUser = {
        ...getTaskUser.dataValues,
        taskDetailId: getTaskUser?.dataValues?.taskDetailId?.split(",") || [],
        list_task: getDetailTask,
        userInfo: getUser.dataValues,
      };

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
      const getListTaskUser = await userTaskMode.findAndCountAll({
        include: [
          {
            model: taskMoodel,
            where: {
              merchantId,
            },
            as: "task",
          },
          {
            model: userModel,
            as: "user",
            attributes: {
              exclude: ["password", "pin", "balance", "status", "bio"],
            },
          },
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getListTaskUser, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
  // let getListDetailTask = await taskDetailMoodel.findAll({
  //   where: {
  //     merchantId,
  //   },
  // });

  // let getListUser = await userModel.findAndCountAll({
  //   attributes: {
  //     exclude: ["password", "pin", "balance", "status"],
  //   },
  //   limit,
  //   offset,
  //   order: [["id", "DESC"]],
  // });

  // const getUserTask = await userTaskMode.findAll();

  // getListDetailTask = getListDetailTask.map((item) => ({
  //   ...item.dataValues,
  //   list_user: item.dataValues?.list_user
  //     ? JSON.parse(item.dataValues.list_user)
  //     : [],
  // }));

  // getListUser = {
  //   ...getListUser,
  //   rows: getListUser.rows.map((item) => ({
  //     ...item.dataValues,
  //     task:
  //       getUserTask.find(
  //         (filter) => filter.dataValues.userId == item.dataValues.id
  //       ) || null,
  //   })),
  // };
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
          banner_img: `${fullURL(req)}${pathBannerTask}/${req.file.filename}`,
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
        banner_img: `${fullURL(req)}${pathBannerTask}/${req.file.filename}`,
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
