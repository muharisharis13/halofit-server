const bookingModel = require("../../models/booking");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");

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
      time = [],
    } = req.body;
    try {
      const result = await bookingModel.create({
        facilityId,
        total,
        price,
        booking_date,
        userId,
        time: JSON.stringify(
          time.map((item, idx) => {
            if (idx == 1) {
              const getHours = item.split(":")[0];
              return `${getHours}:59`;
            } else {
              return item;
            }
          })
        ),
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
}

module.exports = new controllerBooking();
