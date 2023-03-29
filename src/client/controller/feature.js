const featureModel = require("../../models/feature");
const { general } = require("../../../utils");

const { responseJSON } = general;

class controllerFeature {
  async editFeature(req, res) {
    const { feature_id } = req.params;
    const { feature_name } = req.body;
    try {
      const getDetailFeature = await featureModel.findOne({
        where: {
          id: feature_id,
        },
      });

      getDetailFeature.update({
        feature_name,
      });
      responseJSON({
        res,
        status: 200,
        data: getDetailFeature,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async deleteFeature(req, res) {
    const { feature_id } = req.params;
    try {
      const result = await featureModel.destroy({
        where: {
          id: feature_id,
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
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async createFeature(req, res) {
    const { feature_name } = req.body;
    try {
      const result = await featureModel.create({
        feature_name,
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }

  async getDetailFeature(req, res) {
    const { feature_id } = req.params;
    try {
      const result = await featureModel.findOne({
        where: {
          id: feature_id,
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
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }

  async getLiteFeature(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "booking_date",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
    };
    try {
      const getListFeature = await featureModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getListFeature, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
}

module.exports = new controllerFeature();
