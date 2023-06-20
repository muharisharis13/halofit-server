const historyModel = require("../../models/history_user");
const { general, paging, url } = require("../../../utils");
const { responseJSON } = general;
const userModel = require("../../models/user");

class controllerHistoryUser {
  async getHistory(req, res) {
    const { userId } = req.params;
    try {
      const getHistory = await historyModel.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: userModel,
            as: "user",
          },
        ],
      });
      responseJSON({
        res,
        status: 200,
        data: getHistory,
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

module.exports = new controllerHistoryUser();
