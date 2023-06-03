const bookingModel = require("../../models/booking");
const { Op } = require("sequelize");
const userModel = require("../../models/user");
const merchantModel = require("../../models/merchant");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const facilityModel = require("../../models/facility");
const { getPagination, getPagingData } = paging;

class controllerBooking {
  async getBooking(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "",
      fromDate = "",
      toDate = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [Op.or]: [
        {
          [column_name]: {
            [Op.between]: [fromDate, toDate],
          },
        },
        {
          createdAt: {
            [Op.between]: [fromDate, toDate],
          },
        },
      ],
    };
    try {
      const getBooking = await bookingModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: userModel,
            as: "user",
            attributes: [
              "username",
              "email",
              "gender",
              "point",
              "phone_number",
            ],
          },
          {
            model: facilityModel,
            as: "facility",
            attributes: ["facility_name", "merchantId"],
            include: [
              {
                model: merchantModel,
                as: "merchant",
              },
            ],
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          booking: getPagingData(getBooking, page, limit),
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

module.exports = new controllerBooking();
