const merchantModel = require("../../models/merchant");
const facilityModel = require("../../models/facility");
const categoryModel = require("../../models/category");
const { Op } = require("sequelize");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerMerchant {
  async getMerchant(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "merchant_name",
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
          merchant_name: {
            [Op.like]: `%${query}%`,
          },
        },
      ],
    };
    try {
      let getMerchant = await merchantModel.findAndCountAll({
        include: [
          {
            model: facilityModel,
            as: "facilities",
            attributes: ["categoryId", "facility_name"],
            include: [
              {
                model: categoryModel,
                as: "category",
              },
            ],
          },
        ],
        where: condition,
        limit,
        offset,
        order: [["merchant_name", "DESC"]],
      });

      responseJSON({
        res: res,
        data: {
          merchant: getPagingData(getMerchant, page, limit),
        },
        status: 200,
      });
    } catch (error) {
      responseJSON({
        res: res,
        data: error.errors?.map((item) => item.message) || error,
        status: 500,
      });
    }
  }
  async blockMerchant(req, res) {
    const { merchantId } = req.params;
    const { status } = req.body;
    try {
      await merchantModel
        .findOne({
          where: {
            id: merchantId,
          },
        })
        .then((result) => {
          if (result) {
            result.update({
              status,
            });
          }
        });
      responseJSON({
        res,
        status: 200,
        data: {
          status,
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

module.exports = new controllerMerchant();
