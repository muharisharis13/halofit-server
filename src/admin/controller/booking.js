const { general, paging } = require("../../../utils");
const bookingModel = require("../../models/booking");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");

class controllerBooking {
  async createBooking(req, res) {
    const { facilityId, total, price, booking_date, userId, time } = req.body;

    try {
      const result = await bookingModel.create({
        facilityId,
        total,
        price,
        booking_date,
        userId,
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
}

module.exports = new controllerBooking();
