const roomModel = require("../../models/room");
const facilityModel = require("../../models/facility");
const userModel = require("../../models/user");
const bookingModel = require("../../models/booking");
const merchantModel = require("../../models/merchant");
const roomDetailModel = require("../../models/room_detail");
const notifJoinRoomModel = require("../../models/notifications_join_room");
const { general, paging } = require("../../../utils");
const { Op, JSON } = require("sequelize");
const categoryModel = require("../../models/category");
const roomDetail = require("../../models/room_detail");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

const getOneDayTimeStamps = (date) => {
  let newDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);

  return newDate;
};

class controllerRoom {
  async getOwnRoom(req, res) {
    const { user_id } = req.params;

    try {
      const getDetailRoom = await roomDetail.findAll({
        where: {
          userId: user_id,
        },
        include: [
          {
            model: roomModel,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });
      responseJSON({
        res,
        status: 200,
        data: getDetailRoom,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
  async approvedRequestUser(req, res) {
    const { roomId, userId, status_approved } = req.body;
    try {
      const checkRoomAvailable = await roomModel.findOne({
        where: {
          id: roomId,
        },
      });

      if (checkRoomAvailable.id) {
        const getDetailRoomByRoomId = await roomDetailModel.findOne({
          where: {
            roomId,
            userId,
          },
        });

        if (getDetailRoomByRoomId.id) {
          const getResultDetailRoomId = await getDetailRoomByRoomId.update({
            status_approved,
          });

          responseJSON({
            res,
            status: 200,
            data: getResultDetailRoomId,
          });
        } else {
          responseJSON({
            res,
            status: 400,
            data: "Informasi user tidak ditemukan !",
          });
        }
      } else {
        responseJSON({
          res,
          status: 400,
          data: "Room Tidak Tersedia !",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getListReqJoinRoom(req, res) {
    const { user_id } = req.params;
    try {
      const getRoom = await roomModel.findOne({
        where: {
          userId: user_id,
        },
        include: [
          {
            model: userModel,
            as: "user",
            attributes: {
              exclude: ["password", "pin", "createdAt", "updatedAt"],
            },
          },
        ],
      });

      if (getRoom.id) {
        const getListReqJoinRoom = await roomDetailModel.findAll({
          where: {
            roomId: getRoom.id,
            status_approved: "unapproved",
          },
          include: [
            {
              model: userModel,
              as: "user",
              attributes: {
                exclude: ["password", "pin", "createdAt", "updatedAt"],
              },
            },
          ],
        });

        responseJSON({
          res,
          status: 200,
          data: {
            room_info: getRoom,
            list_request: getListReqJoinRoom,
          },
        });
      } else {
        responseJSON({
          res,
          status: 200,
          data: "Room Tidak Ditemukan",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async joinRoom(req, res) {
    const { roomId, userId, qty } = req.body;
    try {
      const findUserInRoomDetail = await roomDetailModel.findOne({
        where: {
          userId: userId,
          roomId: roomId,
        },
      });

      if (findUserInRoomDetail) {
        responseJSON({
          res,
          status: 400,
          data: "User Already Exist This Room !",
        });
      } else {
        const result = await roomDetailModel.create({
          roomId,
          userId,
          qty: qty,
        });

        await notifJoinRoomModel.create({
          roomId,
          roomDetailId: result?.id,
          userId,
        });

        responseJSON({
          res,
          status: 200,
          data: result,
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async deleteRoom(req, res) {
    const { room_id } = req.params;
    try {
      const getDetailRoom = await roomModel.findOne({
        where: {
          id: room_id,
        },
      });

      getDetailRoom.update({
        visibility: false,
      });

      responseJSON({
        res,
        status: 200,
        data: getDetailRoom,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async editRoom(req, res) {
    const { room_id } = req.params;
    const {
      room_name,
      facilityId,
      gender = [],
      range_age,
      max_capacity,
      room_desc,
    } = req.body;
    try {
      const getDetailRoom = await roomModel.findOne({
        where: {
          id: room_id,
        },
      });

      getDetailRoom.update({
        room_name,
        facilityId,
        gender: JSON.stringify(gender),
        range_age,
        max_capacity,
        room_desc,
      });

      responseJSON({
        res,
        status: 200,
        data: getDetailRoom,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getDetailRoom(req, res) {
    const { room_id } = req.params;
    const { user_id } = req.query;
    try {
      const result = await roomModel.findOne({
        where: {
          id: room_id,
        },
        include: [
          {
            model: facilityModel,
            as: "facility",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: categoryModel,
                as: "category",
                attributes: {
                  exclude: ["password", "createdAt", "updatedAt"],
                },
              },
              {
                model: merchantModel,
                as: "merchant",
                attributes: {
                  exclude: ["password", "createdAt", "updatedAt", "balance"],
                },
              },
            ],
          },
          {
            model: userModel,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: bookingModel,
            as: "booking",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["visibility"],
        },
      });

      const getDetailRoom = await roomDetailModel.findAll({
        where: {
          roomId: room_id,
          status_approved: "approved",
        },
        include: [
          {
            model: userModel,
            as: "user",
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "password",
                "pin",
                "balance",
                "poin",
              ],
            },
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          ...result.dataValues,
          hostId: result.dataValues.userId,
          isJoin:
            getDetailRoom.filter(
              (filter) => filter.dataValues.userId == user_id
            ).length == 1
              ? true
              : false,
          room_detail: getDetailRoom,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async getListRoom(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "room_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
      visibility: true,
    };
    try {
      const getListRoom = await roomModel.findAndCountAll({
        where: condition,
        include: [
          {
            model: facilityModel,
            as: "facility",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: merchantModel,
                as: "merchant",
                attributes: {
                  exclude: ["password", "createdAt", "updatedAt", "balance"],
                },
              },
            ],
          },
          {
            model: userModel,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: bookingModel,
            as: "booking",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["visibility"],
        },
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const getDetailRoom = await roomDetailModel.findAll({
        where: {
          status_approved: "approved",
        },
      });

      // console.log({ getDetailRoom })

      const newList = {
        count: getListRoom.count,
        rows: getListRoom.rows.map((item) => ({
          ...item.dataValues,
          room_detail: getDetailRoom.filter(
            (filter) => filter.roomId == item.dataValues.id
          ),
          // room_detail: getDetailRoom(item.id)
        })),
      };

      responseJSON({
        res,
        status: 200,
        data: getPagingData(newList, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async createRoom(req, res) {
    const {
      room_name,
      facilityId,
      gender = [],
      range_age = [],
      max_capacity,
      room_desc,
      hostId,
      bookingId,
    } = req.body;
    try {
      const result = await roomModel.create({
        room_name,
        facilityId,
        gender: gender,
        range_age: range_age,
        max_capacity,
        room_desc,
        userId: hostId,
        room_expired: new Date(getOneDayTimeStamps(new Date())),
        bookingId,
      });

      try {
        const postToRoomDetail = await roomDetailModel.create({
          roomId: result?.id,
          userId: hostId,
          qty: 1,
          status_approved: "approved",
        });

        if (postToRoomDetail?.id) {
          responseJSON({
            res,
            status: 200,
            data: result,
          });
        }
      } catch (error) {
        responseJSON({
          res,
          status: 400,
          data: error.message,
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
}

module.exports = new controllerRoom();
