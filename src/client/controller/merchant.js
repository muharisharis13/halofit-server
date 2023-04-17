const merchantModel = require("../../models/merchant");
const facilityModel = require("../../models/facility");
const categoryModel = require("../../models/category");
const merchantFeatureModel = require("../../models/merchant_feature");
const { general, paging, url } = require("../../../utils");
const { Op } = require("sequelize");
const featureModel = require("../../models/feature");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerMerchant {
  async getDetailMerchant(req, res) {
    const { merchantId } = req.params;
    try {
      const result = await merchantModel.findOne({
        where: {
          id: merchantId,
        },
        raw: true,
      });
      const resultFacility = await facilityModel.findAll({
        where: {
          merchantId,
        },
        include: [
          {
            model: categoryModel,
            as: "category",
          },
        ],
      });

      const getFeature = await merchantFeatureModel.findAll({
        where: {
          merchantId,
        },
        include: [
          {
            model: featureModel,
            as: "feature",
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          ...result,
          facility: resultFacility,
          feature: getFeature,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
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
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(responseMerchant, page, limit),
      });
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
