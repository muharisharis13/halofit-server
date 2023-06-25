const { general, paging } = require("../../../utils");
const bookingModel = require("../../models/booking");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");
const facilityModel = require("../../models/facility");
const userModel = require("../../models/user");

class controllerBooking {
  async createBooking(req, res) {
    const { facilityId, total, price, booking_date, userId, time, type } =
      req.body;

    try {
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
  async bookingList(req, res) {
    try {
      const { merchantId } = req.params;
      const { page = 1, size = 10, query = "" } = req.query;
      const { limit, offset } = getPagination(page, size);
      const getBooking = await bookingModel.findAll({
        include: [
          {
            model: facilityModel,
            as: "facility",
            where: {
              merchantId,
            },
          },
          {
            model: userModel,
            as: "user",
          },
        ],
        limit,
        offset,
        order: [["booking_date", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getBooking,
      });
    } catch (error) {
      console.error("Error retrieving booking list:", error);
      responseJSON({
        res,
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async confirmPayment(req, res) {}
}

module.exports = new controllerBooking();
