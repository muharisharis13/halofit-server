const PromoModel = require("../../models/promo");
const { Op } = require("sequelize");
const merchantModel = require("../../models/merchant");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerPromo {
  async getPromo(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "promo_name",
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
          promo_name: {
            [Op.like]: `%${query}%`,
          },
        },
      ],
    };
    try {
      const getPromo = await PromoModel.findAndCountAll({
        include: [
          {
            model: merchantModel,
            as: "merchant",
          },
        ],
        where: condition,
        limit,
        offset,
        order: [["promo_name", "DESC"]],
      });
      responseJSON({
        res,
        status: 200,
        data: getPagingData(getPromo, page, limit),
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

module.exports = new controllerPromo();
