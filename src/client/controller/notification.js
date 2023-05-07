const notifJoinRoomModel = require("../../models/notifications_join_room");
const roomModel = require("../../models/room");
const userModel = require("../../models/user");
const { general, paging, url } = require("../../../utils");
const { responseJSON } = general;

class controllerNotification {
  async getNotif(req, res) {
    const { userId } = req.params;
    try {
      const getListReqJoinRoom = await notifJoinRoomModel.findAll({
        where: {
          show: true,
          // status_notif: "request",
        },
        attributes: {
          exclude: ["show"],
        },
        include: [
          {
            model: roomModel,
          },
          {
            model: userModel,
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "gender",
                "pin",
                "balance",
                "point",
                "password",
              ],
            },
          },
        ],
      });

      const newListReqJoinRoom = getListReqJoinRoom.filter(
        (filter) => filter.dataValues.room?.userId == userId
      );

      responseJSON({
        res,
        status: 200,
        data: newListReqJoinRoom,
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

module.exports = new controllerNotification();
