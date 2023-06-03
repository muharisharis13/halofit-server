const roomModel = require("../../models/room");
const { Op } = require("sequelize");
const userModel = require("../../models/user");
const facilityModel = require("../../models/facility");
const bookingModel = require("../../models/booking");
const categoryModel = require("../../models//category");
const merchantModel = require("../../models/merchant");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerRoom {
  async getRoom(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "room_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [Op.or]: [
        {
          [column_name]: {
            [Op.like]: `%${query}%`,
          },
        },
        {
          room_name: {
            [Op.like]: `%${query}%`,
          },
        },
      ],
    };
    try {
      let getRoom = await roomModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["room_name", "DESC"]],
        include: [
          {
            model: bookingModel,
            as: "booking",
            attributes: ["total"],
          },
          {
            model: facilityModel,
            as: "facility",
            attributes: ["facility_name"],
            include: [
              {
                model: merchantModel,
                as: "merchant",
                attributes: ["merchant_name"],
              },
              {
                model: categoryModel,
                as: "category",
                attributes: ["category_name"],
              },
            ],
          },
          {
            model: userModel,
            as: "user",
            attributes: ["username"],
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          room_info: getPagingData(getRoom, page, limit),
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

module.exports = new controllerRoom();
