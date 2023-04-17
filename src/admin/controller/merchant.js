const merchantModel = require("../../models/merchant");
const merchantTimeModel = require("../../models/merchant_time");
const merchantFeatureModel = require("../../models/merchant_feature");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");

class controllerMerchant {
  async addFeature(req, res) {
    const { merchantId = 2, featureId = 1 } = req.body;
    try {
      const checkDuplicate = await merchantFeatureModel.findOne({
        where: {
          featureId,
        },
        raw: true,
      });

      if (!checkDuplicate) {
        const result = await merchantFeatureModel.create({
          merchantId,
          featureId,
        });

        responseJSON({
          res,
          status: 200,
          data: result,
        });
      } else {
        responseJSON({
          res,
          status: 400,
          data: "Prasarana Sudah Di Ada",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }
  async getListTimeOpenAndClose(req, res) {
    const { merchant_id } = req.params;
    try {
      const result = await merchantTimeModel.findOne({
        where: {
          merchantId: merchant_id,
        },
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }
  async addTimeOpenAndClose(req, res) {
    const { merchant_id } = req.params;
    const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
      req.body;
    try {
      const result = await merchantTimeModel.create({
        merchantId: merchant_id,
        sunday: JSON.stringify(sunday),
        monday: JSON.stringify(monday),
        tuesday: JSON.stringify(tuesday),
        wednesday: JSON.stringify(wednesday),
        thursday: JSON.stringify(thursday),
        friday: JSON.stringify(friday),
        saturday: JSON.stringify(saturday),
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }
  async getListMerchant(req, res) {
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
      const getMerchant = await merchantModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getMerchant, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }
}

module.exports = new controllerMerchant();
