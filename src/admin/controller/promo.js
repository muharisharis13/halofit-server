const PromoModel = require("../../models/promo");
const { general } = require("../../../utils");
const { responseJSON } = general;
const { paging, url } = require("../../../utils");
const { pathPromo } = require("../../../utils/url");
const { fullURL } = url;
const userPromoModel = require("../../models/user_promo");
const userModel = require("../../models/user.js");

class controllerPromo {
  async getPromo(req, res) {
    const { merchantId } = req.params;
    try {
      const result = await PromoModel.findAll({
        where: {
          merchantId,
        },
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

  async getDetailPromo(req, res) {
    const { idPromo } = req.params;
    try {
      const result = await PromoModel.findOne({
        where: {
          id: idPromo,
        },
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
  async createPromo(req, res) {
    const {
      promo_name,
      userId,
      merchantId,
      point,
      ExpiredIn,
      cost,
      status_promo = "Belum Digunakan",
    } = req.body;

    try {
      if (req.file) {
        const createPromo = PromoModel.create({
          promo_name,
          userId,
          merchantId,
          point,
          ExpiredIn,
          cost,
          promo_img: req.file.filename,
          status_promo,
        });

        responseJSON({
          res,
          status: 200,
          data: createPromo,
        });
      } else {
        responseJSON({
          res,
          status: 400,
          data: "File Must Be Upload",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }

  async updatePromo(req, res) {
    const { idPromo } = req.params;
    const { promo_name, merchantId, point, ExpiredIn, cost } = req.body;
    try {
      if (!req.file) {
        return responseJSON({
          res,
          status: 400,
          data: "File must be uploaded!",
        });
      }
      const result = await PromoModel.findOne({
        where: {
          id: idPromo,
        },
      });
      if (req.file?.filename) {
        result.update({
          promo_img: req.file.filename,
        });
      }
      result.update({
        promo_name,
        merchantId,
        point,
        ExpiredIn,
        cost,
      });

      responseJSON({
        res,
        status: 200,
        data: "Promo updated",
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }

  async deletePromo(req, res) {
    const { idPromo } = req.params;
    try {
      const deletePromo = await PromoModel.destroy({
        where: {
          id: idPromo,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: deletePromo,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }

  async getUserPromo(req, res) {
    const { merchantId } = req.params;
    try {
      const getUserPromo = await userPromoModel.findAll({
        where: {
          merchantId,
        },
        include: [
          {
            model: PromoModel,
            as: "promo",
          },
          {
            model: userModel,
            as: "user",
          },
        ],
      });
      responseJSON({
        res,
        status: 200,
        data: getUserPromo,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }

  async getDetailUserPromo(req, res) {
    const { userPromoId } = req.params;
    try {
      const result = await userPromoModel.findOne({
        where: {
          id: userPromoId,
        },
        include: [
          {
            model: PromoModel,
            as: "promo",
          },
          {
            model: userModel,
            as: "user",
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
        data: error.message,
      });
    }
  }

  async updateDetailUserPromo(req, res) {
    const { id } = req.params;
    const { status_promo = "Sudah digunakan" } = req.body;
    try {
      const getUserPromo = await userPromoModel.findOne({
        where: {
          id,
        },
      });
      await getUserPromo.update({
        status_promo,
      });
      responseJSON({
        res,
        status: 200,
        data: "User Promo sudah digunakan",
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
