const promoModel = require("../../models/promo");
const facilityModel = require("../../models/facility");
const merchantModel = require("../../models/merchant");
const categoryModel = require("../../models/category");
const userPromoModel = require("../../models/user_promo");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const userModel = require("../../models/user");
const {
  fullURL,
  pathMerchant,
  pathBanner,
  pathPromo,
} = require("../../../utils/url");

class controllerPromo {
  async getPromo(req, res) {
    try {
      const getPromo = await promoModel.findAll({
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: ["id", "merchant_name"],
            include: {
              model: facilityModel,
              as: "facilities",
              attributes: ["id"],
              include: {
                model: categoryModel,
                as: "category",
                attributes: ["category_name"],
              },
            },
          },
        ],
      });
      const newData = getPromo.map((promo) => ({
        ...promo.toJSON(),
        promo_img: `${fullURL(req)}${pathPromo}/${promo.promo_img}`,
      }));

      responseJSON({
        res,
        status: 200,
        data: newData,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
  async usePromo(req, res) {
    const {
      promoId,
      userId,
      status_promo = "belum digunakan",
      poin,
      merchantId,
    } = req.body;

    try {
      const result = await userPromoModel.create({
        promoId,
        userId,
        status_promo,
        merchantId,
      });
      const getUser = await userModel.findOne({
        where: {
          id: userId,
        },
      });

      await getUser.update({
        point: parseInt(getUser.dataValues.point) - parseInt(poin),
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
        data: error.message,
      });
    }
  }
  async getOwnPromo(req, res) {
    const { userId } = req.params;
    try {
      const getOwnPromo = await userPromoModel.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: promoModel,
            as: "promo",
            include: {
              model: merchantModel,
              as: "merchant",
            },
          },
        ],
      });
      const newData = getOwnPromo.map((promo) => ({
        ...promo.toJSON(),
        promo_img: `${fullURL(req)}${pathPromo}/${promo.promo.promo_img}`,
      }));
      responseJSON({
        res,
        status: 200,
        data: newData,
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
