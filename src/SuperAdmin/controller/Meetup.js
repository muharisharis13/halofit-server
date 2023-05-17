const roomModel = require("../../models/room");
const userModel = require("../../models/user");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerRoom {
  async getRoom(req, res) {
    try {
      const getRoom = await roomModel.findAll({
        include: [
          {
            model: userModel,
            as: "user",
            attributes: ["username", "email", "gender", "point"],
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          task_info: getRoom,
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

module.exports = new controllerRoom();
