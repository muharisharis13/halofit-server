const notifJoinRoomModel = require("../../models/notifications_join_room");
const roomModel = require("../../models/room");
const userModel = require("../../models/user");
const historyModel = require("../../models/history_user");
const { general, paging, url } = require("../../../utils");
const roomDetailModel = require("../../models/room_detail");
const { responseJSON } = general;
const {
  fullURL,
  pathMerchant,
  pathBanner,
  pathProfile,
} = require("../../../utils/url");

class controllerNotification {
  async rejectRequstJoinRoom(req, res) {
    const { roomId, userIdRequestJoin } = req.body;
    try {
      let getNotif = await notifJoinRoomModel.findOne({
        where: {
          roomId,
        },
      });
      if (getNotif) {
        getNotif
          .update({
            list_user: JSON.stringify(
              JSON.parse(getNotif.dataValues.list_user)?.map((item) => {
                if (item.userId == userIdRequestJoin) {
                  return {
                    ...item,
                    status: "reject",
                  };
                }
                return item;
              })
            ),
          })
          .then(async (result) => {
            const getRoomDetail = await roomDetailModel.findOne({
              where: {
                roomId,
                userId: userIdRequestJoin,
              },
            });

            if (getRoomDetail) {
              getRoomDetail.update({
                status_approved: "reject",
              });

              await userModel
                .findOne({
                  where: {
                    id: userIdRequestJoin,
                  },
                })
                .then((result) => {
                  result.update({
                    balance:
                      parseInt(result?.dataValues?.balance) +
                      getRoomDetail?.dataValues?.payment,
                  });
                });
              const getRoom = await roomModel.findOne({
                where: {
                  id: roomId,
                },
              });
              await historyModel.create({
                nominal: getRoomDetail?.dataValues?.payment,
                description:
                  "Pengembalian dana join meetup " +
                  getRoom.dataValues?.room_name,
                type: "meetup",
                userId: userIdRequestJoin,
              });
              responseJSON({
                res,
                status: 200,
                data: getNotif,
              });
            } else {
              responseJSON({
                res,
                status: 400,
                data: "Room Tidak Ditemukan",
              });
            }
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
  async approveRequestJoinRoom(req, res) {
    const { roomId, userIdRequestJoin } = req.body;
    try {
      let getNotif = await notifJoinRoomModel.findOne({
        where: {
          roomId,
        },
      });
      if (getNotif) {
        getNotif
          .update({
            list_user: JSON.stringify(
              JSON.parse(getNotif.dataValues.list_user)?.map((item) => {
                if (item.userId == userIdRequestJoin) {
                  return {
                    ...item,
                    status: "complete",
                  };
                }
                return item;
              })
            ),
          })
          .then(async (result) => {
            const getRoomDetail = await roomDetailModel.findOne({
              where: {
                roomId,
                userId: userIdRequestJoin,
              },
            });

            if (getRoomDetail) {
              getRoomDetail.update({
                status_approved: "approved",
              });
              responseJSON({
                res,
                status: 200,
                data: getNotif,
              });
            } else {
              responseJSON({
                res,
                status: 400,
                data: "Room Tidak Ditemukan",
              });
            }
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
  async getNotif(req, res) {
    const { userId } = req.params;
    try {
      const getUser = await userModel.findAll();
      const getListNotifRequesJoinRoom = await notifJoinRoomModel.findAll({
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

            include: [
              {
                model: userModel,
                attributes: {
                  exclude: [
                    "createdAt",
                    "updatedAt",
                    "password",
                    "balance",
                    "point",
                    "pin",
                  ],
                },
              },
            ],
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

      // const newListReqJoinRoom =
      //   getListNotifRequesJoinRoom
      //     // .filter((filter) => filter.dataValues.room?.userId == userId)
      //     .map((item) => ({
      //       ...item.dataValues,
      //       room: {
      //         ...item.dataValues?.room?.dataValues,
      //         isHost: item.dataValues?.room?.userId == userId,
      //       },
      //       list_user: JSON.parse(item.dataValues?.list_user)?.map((item) => ({
      //         ...item,
      //         userId: parseInt(item?.userId),
      //         user: getUser.find(
      //           (filter) => filter.dataValues?.id == parseInt(item?.userId)
      //         ),
      //       })),
      //     }))
      //     ?.filter((filter) =>
      //       filter.list_user?.find((find) => find.userId == userId) ||
      //       filter?.room?.isHost == true
      //         ? true
      //         : false
      //     ) || getListNotifRequesJoinRoom;

      const newListReqJoinRoom =
        getListNotifRequesJoinRoom
          .map((item) => {
            const room = {
              ...item.dataValues?.room?.dataValues,
              user: {
                ...item.dataValues?.room?.dataValues?.user.dataValues,
                profile_img: `${fullURL(req)}${pathProfile}/${
                  item.dataValues?.room?.dataValues?.user.profile_img
                }`,
              },
              isHost: item.dataValues?.room?.userId == userId,
            };

            const list_user = JSON.parse(item.dataValues?.list_user)?.map(
              (item) => {
                const filter = getUser.find(
                  (filter) => filter.dataValues?.id == parseInt(item?.userId)
                );

                return {
                  ...item,
                  userId: parseInt(item?.userId),
                  user: {
                    ...filter.dataValues,
                    profile_img: `${fullURL(req)}${pathProfile}/${
                      filter.dataValues?.profile_img
                    }`,
                  },
                };
              }
            );

            return {
              ...item.dataValues,
              room,
              list_user,
            };
          })
          .filter(
            (filter) =>
              filter.list_user?.find((find) => find.userId == userId) ||
              filter?.room?.isHost
          ) || getListNotifRequesJoinRoom;
      responseJSON({
        res,
        status: 200,
        data: newListReqJoinRoom,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
}

module.exports = new controllerNotification();
