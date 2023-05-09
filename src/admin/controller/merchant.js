const merchantModel = require("../../models/merchant");
const merchantTimeModel = require("../../models/merchant_time");
const merchantFeatureModel = require("../../models/merchant_feature");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");
const featureModel = require("../../models/feature");
const facilityModel = require("../../models/facility");

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

  async getDetailMerchant(req, res) {
    const { merchantId } = req.params;
    try {
      const result = await merchantModel.findOne({
        where: {
          id: merchantId,
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (!result) {
        responseJSON({
          res,
          status: 400,
          data: "Merchant Tidak ditemukan !",
        });
      } else {
        const getMerchantFeature = await merchantFeatureModel.findAll({
          where: {
            merchantId: result.dataValues.id,
          },
          include: [
            {
              model: featureModel,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        });

        const getMerchantTime = await merchantTimeModel.findOne({
          where: {
            merchantId: result.dataValues.id,
          },
        });

        const getFacility = await facilityModel.findAll({
          where: {
            merchantId: result.dataValues.id,
          },
        });

        responseJSON({
          res,
          status: 200,
          data: {
            merchant_info: result,
            feature_merchant: getMerchantFeature,
            merchant_time: getMerchantTime
              ? {
                  ...getMerchantTime.dataValues,
                  sunday: JSON.parse(getMerchantTime.dataValues.sunday),
                  monday: JSON.parse(getMerchantTime.dataValues.monday),
                  tuesday: JSON.parse(getMerchantTime.dataValues.tuesday),
                  wednesday: JSON.parse(getMerchantTime.dataValues.wednesday),
                  thursday: JSON.parse(getMerchantTime.dataValues.thursday),
                  friday: JSON.parse(getMerchantTime.dataValues.friday),
                  saturday: JSON.parse(getMerchantTime.dataValues.saturday),
                }
              : null,
            facility: getFacility,
          },
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.message,
      });
    }
  }
}

module.exports = new controllerMerchant();
