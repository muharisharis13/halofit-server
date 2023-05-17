const { Op } = require("sequelize");
const { general } = require("../../../utils");
const { responseJSON } = require("../../../utils/general");
const { getPagination, getPagingData } = require("../../../utils/paging");
const featureModel = require("../../models/feature");
const merchantFeatureModel = require("../../models/merchant_feature");

class controllerFeature {
  async updateFeature(req, res) {
    const { merchantId, featureId } = req.body;
    try {
      if (!merchantId) {
        responseJSON({
          res,
          status: 400,
          data: `merchantId must be used !`,
        });
      }
      if (!featureId) {
        responseJSON({
          res,
          status: 400,
          data: `featureId must be used !`,
        });
      }
      const findFeature = await merchantFeatureModel.findOne({
        where: {
          merchantId,
          featureId,
        },
      });

      if (findFeature) {
        findFeature.destroy();
        responseJSON({
          res,
          status: 200,
          data: findFeature,
        });
      } else {
        await merchantFeatureModel.create({
          merchantId,
          featureId,
        });
        responseJSON({
          res,
          status: 200,
          data: merchantFeatureModel,
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
  async getListFeature(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "feature_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);

    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
    };
    try {
      const getFeature = await featureModel.findAndCountAll({
        like: query,
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getFeature, page, limit),
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

module.exports = new controllerFeature();
