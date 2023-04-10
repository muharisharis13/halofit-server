const merchantModel = require("../../models/merchant")
const { general, paging, url } = require("../../../utils");
const { Op } = require("sequelize");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerMerchant {

  async getAllMerchant(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "merchant_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
    };
    try {
      const responseMerchant = await merchantModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
      })

      responseJSON({
        res,
        status: 200,
        data: getPagingData(responseMerchant, page, limit)
      })
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }

}

module.exports = new controllerMerchant();