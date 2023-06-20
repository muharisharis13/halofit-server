const bookingModel = require("../../models/booking");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");
const userModel = require("../../models/user");
const merchantModel = require("../../models/merchant");
const facilityModel = require("../../models/facility");
const historyModel = require("../../models/history_user");
const roomDetail = require("../../models/room_detail");
const roomModel = require("../../models/room");

class controllerBooking {
  async deleteBooking(req, res) {
    const { booking_id } = req.params;
    try {
      const result = await bookingModel.destroy({
        where: {
          id: booking_id,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async editBooking(req, res) {
    const { booking_id } = req.params;
    const { booking_date, time } = req.body;
    try {
      const getDetailBooking = await bookingModel.findOne({
        where: {
          id: booking_id,
        },
      });

      getDetailBooking.update({
        booking_date,
        time,
      });
      responseJSON({
        res,
        status: 200,
        data: getDetailBooking,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async cancelBooking(req, res) {
    const { userId, bookingId } = req.body;
    try {
      const getUserBooking = await bookingModel.findOne({
        where: {
          userId,
          show: true,
          id: bookingId,
        },
      });

      await getUserBooking.update({
        where: {
          visibility: false,
        },
      });

      if (getUserBooking) {
        //hitung uang refund ke user 80%
        const refundPayment = parseInt(getUserBooking?.dataValues?.total) * 0.8;

        //hitung uang refung ke mitra 20%
        const refundMitra = parseInt(getUserBooking?.dataValues?.total) * 0.2;

        const getFacility = await facilityModel.findOne({
          where: {
            id: getUserBooking?.dataValues?.facilityId,
          },
        });

        const getMerchant = await merchantModel.findOne({
          where: {
            id: getFacility?.dataValues?.merchantId,
          },
        });

        const getUser = await userModel.findOne({
          where: {
            id: userId,
          },
        });

        try {
          if (getMerchant) {
            getMerchant.update({
              balance:
                parseInt(getMerchant?.dataValues?.balance) +
                parseInt(refundMitra),
            });
          }

          if (getUser) {
            getUser.update({
              balance: parseInt(getUser?.balance) + parseInt(refundPayment),
            });
          }
          historyModel.create({
            nominal: parseInt(refundMitra),
            description: "Cancel di " + getFacility.dataValues?.facility_name,
            type: "reserve",
            userId: userId,
          });

          getUserBooking.update({
            show: false,
          });

          responseJSON({
            res,
            status: 200,
            data: "Berhasil Cancel",
          });
        } catch (error) {
          return error;
        }
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error?.message,
      });
    }
  }
  async getOwnBooking(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "booking_date",
      query = "",
    } = req.query;
    const { userId } = req.params;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
      show: true,
      userId,
      type: "reserve",
    };
    try {
      const getListBooking = await bookingModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
        include: [
          {
            model: facilityModel,
            as: "facility",
            attributes: ["facility_name"],
            include: [
              {
                model: merchantModel,
                as: "merchant",
                attributes: ["address"],
              },
            ],
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getListBooking, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error?.message,
      });
    }
  }
  async getListBooking(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "booking_date",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },

      show: true,
    };
    try {
      const getListBooking = await bookingModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getListBooking, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getDetailBooking(req, res) {
    const { booking_id } = req.params;
    try {
      const result = await bookingModel.findOne({
        where: {
          id: booking_id,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async createBooking(req, res) {
    const {
      facilityId,
      total,
      price,
      booking_date,
      userId,
      time,
      payment = false,
      type,
    } = req.body;
    try {
      const getUser = await userModel.findOne({
        where: {
          id: userId,
        },
      });
      const result = await bookingModel.create({
        facilityId,
        total,
        price,
        booking_date,
        userId,
        type,
        time: time
          ? JSON.stringify(
              JSON.parse(time).map((item, idx) => {
                if (idx + 1 === time.length) {
                  const getHours = item.split(":")[0];
                  return `${getHours}:00`;
                } else {
                  return item;
                }
              })
            )
          : [],
      });

      if (payment) {
        //mengurangi balance di user dari hasil reserve
        getUser.update({
          balance: parseInt(getUser?.dataValues?.balance) - parseInt(total),
        });
        const nominalPayment = 0 - parseInt(total);
        const facility = await facilityModel.findOne({
          where: {
            id: facilityId,
          },
        });

        historyModel.create({
          nominal: 0 - parseInt(nominalPayment),
          description: "Reservasi di " + facility.dataValues?.facility_name,
          type: "reserve",
          userId: userId,
        });
      }
      // const booking = await bookingModel.findAll();
      // const roomDetail = await roomModel.findAll();
      // const description = booking.map((item) => {
      //   const room = roomDetail.filter(
      //     (room) => room.dataValues?.bookingId === item.dataValues?.id
      //   );

      //   return {
      //     ...item.dataValues,
      //     room_name: room ? room.room_name : "",
      //   };
      // });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message) || error?.message,
      });
    }
  }
}

module.exports = new controllerBooking();
