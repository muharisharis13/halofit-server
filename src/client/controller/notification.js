const notifJoinRoomModel = require("../../models/notifications_join_room");
const roomModel = require("../../models/room");
const userModel = require("../../models/user");
const { general, paging, url } = require("../../../utils");
const roomDetailModel = require("../../models/room_detail");
const { responseJSON } = general;

class controllerNotification {
  async getNotif(req, res) {
    const { userId } = req.params;
    try {
      const getListDetailRoomByUserId = await roomDetailModel.findAll({
        where: {
          userId,
        },
      });
      const getListRequesJoinRoom = await notifJoinRoomModel.findAll({
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

      const getStatusByInfo = getListRequesJoinRoom.filter(
        (filter) => filter.dataValues.status_notif === "info"
      );

      const newListReqJoinRoom = getListRequesJoinRoom
        .filter((filter) => filter.dataValues.room?.userId == userId)
        .map((item) => ({
          ...item.dataValues,
          status_approved:
            getListDetailRoomByUserId.filter(
              (filter) => filter.dataValues.id === item.dataValues.roomDetailId
            )[0] || null,
        }));

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
