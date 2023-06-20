const roomModel = require("../../models/room");
const facilityModel = require("../../models/facility");
const userModel = require("../../models/user");
const bookingModel = require("../../models/booking");
const merchantModel = require("../../models/merchant");
const roomDetailModel = require("../../models/room_detail");
const superAdminModel = require("../../models/SuperAdmin");
const notifJoinRoomModel = require("../../models/notifications_join_room");
const { general, paging } = require("../../../utils");
const { Op } = require("sequelize");
const categoryModel = require("../../models/category");
const roomDetail = require("../../models/room_detail");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const {
  fullURL,
  pathMerchant,
  pathBanner,
  pathProfile,
} = require("../../../utils/url");

const getOneDayTimeStamps = (date) => {
  let newDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);

  return newDate;
};

const paymentUser = async (userId, payment) => {
  try {
    const result = await userModel.findOne({
      where: {
        id: userId,
      },
    });

    return result.update({
      balance: parseInt(result?.dataValues?.balance) - parseInt(payment),
    });
  } catch (error) {
    return error.message;
  }
};

class controllerRoom {
  async StartRoom(req, res) {
    const { roomId, userId } = req.body;
    try {
      const result = await roomModel.findOne({
        where: {
          id: roomId,
          userId,
        },
      });

      const getDetailRoom = await roomDetailModel.findAll({
        where: {
          roomId: roomId,
        },
      });
      const getBooking = await bookingModel.findOne({
        where: {
          id: result?.dataValues?.bookingId,
        },
      });

      const getUser = await userModel.findOne({
        where: {
          id: result?.dataValues?.userId,
        },
      });
      const getFacility = await facilityModel.findOne({
        where: {
          id: result?.dataValues?.facilityId,
        },
      });
      const getMerchant = await merchantModel.findOne({
        where: {
          id: getFacility?.dataValues?.merchantId,
        },
      });

      const getAllPayment = getDetailRoom
        .map((item) => item.dataValues.payment)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const getTotalPayment = getBooking?.dataValues?.total;

      const finalPayment = getAllPayment - getTotalPayment;

      if (finalPayment > 0) {
        getUser.update({
          //pengembalian dana dp ke user
          balance:
            parseInt(getUser.dataValues?.balance) + parseInt(finalPayment),
        });
        result.update({
          // merubah status dari waiting ke playing
          status_room: "playing",
        });

        getMerchant.update({
          balance: parseInt(getMerchant.dataValues?.balance) + getTotalPayment,
        });

        responseJSON({
          res,
          status: 200,
          data: "success",
        });
      } else {
        responseJSON({
          res,
          status: 200,
          data: "Pembayaran Masih Berkurang",
        });
      }
      // responseJSON({
      //   res,
      //   status: 200,
      //   data: { getDetailRoom, getAllPayment, result, getBooking, getTotalPayment, finalPayment, getUser, getFacility, getMerchant },
      // });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.message,
      });
    }
  }
  async getOwnRoom(req, res) {
    const { user_id } = req.params;

    try {
      let getRoom = await roomModel.findAll({
        where: {
          visibility: true,
        },
        include: [
          {
            model: facilityModel,
            as: "facility",
            include: [
              {
                model: merchantModel,
                as: "merchant",
              },
            ],
          },
          {
            model: bookingModel,
            as: "booking",
            where: {
              userId: user_id,
            },
          },
        ],
      });

      let getDetailRoom = await roomDetail.findAll();

      getRoom = getRoom.map((item) => ({
        ...item.dataValues,
        banner_img: `${fullURL(req)}${pathBanner}/${item.facility.banner_img}`,
        list_user: getDetailRoom.filter(
          (filter) => filter.dataValues?.roomId == item.dataValues?.id
        ),
      }));

      getRoom = getRoom.filter((filter) =>
        filter?.list_user?.filter((val) => val?.userId == user_id)?.length > 0
          ? true
          : false
      );

      responseJSON({
        res,
        status: 200,
        data: getRoom,
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

        const getDetailNotifJoinRoom = await notifJoinRoomModel.findOne({
          where: {
            roomId,
            userId,
          },
        });

        if (getDetailRoomByRoomId.id && getDetailNotifJoinRoom.id) {
          const getResultDetailRoomId = await getDetailRoomByRoomId.update({
            status_approved,
          });

          if (status_approved === "reject") {
            await getDetailNotifJoinRoom.update({
              status_notif: "reject",
            });
          } else {
            await getDetailNotifJoinRoom.update({
              status_notif: "info",
            });
          }

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
      const getRoom = await roomModel.findAndCountAll({
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
  async cancelJoin(req, res) {
    const { roomId, userId, isHost = false, bookingId } = req.body;
    console.log({ isHost });
    if (isHost === "true") {
      try {
        const getRoomDetail = await roomDetail.findAll({
          where: {
            roomId,
          },
        });

        const getUserHost = await userModel.findOne({
          where: {
            id: userId,
          },
        });

        const getBooking = await bookingModel.findOne({
          where: {
            id: bookingId,
          },
        });

        const getRoom = await roomModel.findOne({
          where: {
            id: roomId,
          },
          include: [
            {
              model: facilityModel,
              as: "facility",
              attributes: ["id", "merchantId"],
            },
          ],
        });

        //kembalikan uang member ke masing masing dompet

        const getMember = getRoomDetail.filter(
          (filter) => filter.dataValues.userId != userId
        ); //filter hostnya
        console.log(getMember);
        getMember.map(async (item) => {
          await userModel
            .findOne({
              where: {
                id: item?.dataValues?.userId,
              },
            })
            .then((resultUser) => {
              resultUser.update({
                balance:
                  parseInt(resultUser?.dataValues?.balance) +
                  parseInt(item?.dataValues?.payment),
              });
            });
        });

        //pindahkan uang host room ke mitra/merchant
        const getTotal = getBooking.dataValues?.total;

        const dp = parseInt(getTotal) * 0.2;

        const getHost = getRoomDetail.find(
          (filter) => filter.dataValues.userId == userId
        );

        if (getHost?.dataValues?.payment) {
          const getMerchant = await merchantModel.findOne({
            where: {
              id: getRoom?.dataValues?.facility?.merchantId,
            },
          });

          const returnPayment =
            parseInt(getHost?.dataValues?.payment) - parseInt(dp);

          if (getMerchant) {
            getMerchant.update({
              balance:
                parseInt(getMerchant?.dataValues?.balance) + parseInt(dp),
            });
          }

          if (getUserHost) {
            getUserHost.update({
              balance:
                parseInt(returnPayment) +
                parseInt(getUserHost?.dataValues?.balance),
            });
          }
        }

        // hapus room
        await getRoom.update({
          visibility: false,
        });
        await getBooking.update({
          show: false,
        });

        //hapus room detail
        await getRoomDetail.map(async (item) => {
          await roomDetailModel
            .findOne({
              where: {
                userId: item?.dataValues?.userId,
              },
            })
            .then((result) => {
              result.destroy();
            });
        });

        responseJSON({
          res,
          status: 200,
          data: getMember,
        });
      } catch (error) {
        responseJSON({
          res,
          status: 400,
          data: error.message,
        });
      }
    } else {
      try {
        const result = await roomDetail.findOne({
          where: {
            roomId,
            userId,
          },
        });

        const getSuperAdmin = await superAdminModel.findOne({
          where: {
            username: "admin",
          },
        });

        if (
          result?.dataValues?.payment != 0 ||
          result?.dataValues?.payment != "" ||
          result?.dataValues?.payment != undefined ||
          result?.dataValues?.payment != null
        ) {
          getSuperAdmin.update({
            balance:
              parseInt(getSuperAdmin?.dataValues?.balance) +
              parseInt(result?.dataValues.payment),
          });

          await roomDetail.destroy({
            where: {
              userId,
            },
          });

          responseJSON({
            res,
            status: 200,
            data: result,
          });
        } else {
          responseJSON({
            res,
            status: 400,
            data: "payment is no have !",
          });
        }
      } catch (error) {
        responseJSON({
          res,
          status: 400,
          data: error.message,
        });
      }
    }
  }

  async joinRoom(req, res) {
    const { roomId, userId, qty, payment } = req.body;
    try {
      const findUserInRoomDetail = await roomDetailModel.findOne({
        where: {
          userId: userId,
          roomId: roomId,
        },
      });

      if (findUserInRoomDetail) {
        const getUserInRoomDetail = await roomDetailModel.findOne({
          where: {
            roomId,
            userId,
          },
        });

        if (getUserInRoomDetail) {
          getUserInRoomDetail.update({
            status_approved: "unapproved",
          });
          paymentUser(userId, payment);
          const findNotifByRoom = await notifJoinRoomModel.findOne({
            where: {
              roomId,
              // roomDetailId: result?.id,
            },
          });

          findNotifByRoom.update({
            list_user: JSON.stringify([
              ...JSON.parse(findNotifByRoom?.dataValues?.list_user).filter(
                (filter) => filter?.userId != userId
              ),
              {
                userId: userId,
                status: "request",
              },
            ]),
          });

          responseJSON({
            res,
            status: 200,
            data: "Ready Join Again !",
          });
        }
      } else {
        const result = await roomDetailModel.create({
          roomId,
          userId,
          qty: qty,
          payment,
        });
        const findNotifByRoom = await notifJoinRoomModel.findOne({
          where: {
            roomId,
            // roomDetailId: result?.id,
          },
        });
        paymentUser(userId, payment);
        if (!findNotifByRoom) {
          await notifJoinRoomModel.create({
            roomId,
            roomDetailId: result?.id,
            userId: 0,
            list_user: JSON.stringify([{ userId: userId, status: "request" }]),
          });
        } else {
          findNotifByRoom.update({
            list_user: JSON.stringify([
              ...JSON.parse(findNotifByRoom?.dataValues?.list_user).filter(
                (filter) => filter?.userId != userId
              ),
              {
                userId: userId,
                status: "request",
              },
            ]),
          });
        }

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

      const getFacility = await facilityModel.findOne({
        where: {
          id: result.dataValues.facilityId,
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
      });
      const updatedDetailRoom = getDetailRoom.map((item) => ({
        ...item.dataValues,
        profile_img: `${fullURL(req)}${pathProfile}/${item.user?.profile_img}`,
      }));

      const newData = {
        ...result.dataValues,
        facility: {
          ...getFacility.dataValues,
          banner_img: `${fullURL(req)}${pathBanner}/${
            getFacility.dataValues.banner_img
          }`,
        },
        hostId: result.dataValues.userId,
        isJoin: getDetailRoom.some(
          (filter) => filter.dataValues.userId == user_id
        ),
        room_detail: updatedDetailRoom,
      };

      responseJSON({
        res,
        status: 200,
        data: newData,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.message,
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
      status_room: "waiting",
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

      const getFacility = await facilityModel.findAll({
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt", "balance"],
            },
          },
        ],
      });

      const newList = {
        count: getListRoom.count,
        rows: getListRoom.rows.map((item) => {
          const facility = getFacility.find(
            (filter) => filter.dataValues?.id === item?.dataValues?.facilityId
          );
          const facilityData = facility
            ? {
                ...facility.dataValues,
                banner_img: `${fullURL(req)}${pathBanner}/${
                  facility?.dataValues?.banner_img
                }`,
              }
            : null;

          return {
            ...item.dataValues,
            facility: facilityData,
            room_detail: getDetailRoom.filter(
              (filter) => filter.roomId == item.dataValues.id
            ),
          };
        }),
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
        data: error.message,
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
      payment,
      room_expired,
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
        room_expired: new Date(room_expired),
        // room_expired: new Date(getOneDayTimeStamps(new Date())),
        bookingId,
      });

      try {
        const postToRoomDetail = await roomDetailModel.create({
          roomId: result?.id,
          userId: hostId,
          qty: 1,
          status_approved: "approved",
          payment: payment,
        });

        paymentUser(hostId, payment);

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
