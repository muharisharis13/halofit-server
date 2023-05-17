const taskModel = require("../../models/task");
const merchantModel = require("../../models/merchant");
const { general, paging } = require("../../../utils");
const taskDetailModel = require("../../models/task_detail");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerTask {
  async getTask(req, res) {
    try {
      const getTask = await taskModel.findAll({
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: ["id", "email", "merchant_name", "address"],
          },
          {
            model: merchantModel,
            as: "merchant",
            attributes: ["id", "email", "merchant_name", "address"],
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          task_info: getTask,
        },
      });
    } catch (error) {
      responseJSON({
        res: res,
        data: error.errors?.map((item) => item.message) || error,
        status: 500,
      });
    }
  }
}

module.exports = new controllerTask();
