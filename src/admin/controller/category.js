const { general, paging } = require("../../../utils");
const categoryModel = require("../../models/category");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");

class controllerCategory {
  async getListCat(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "no_faktur",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);

    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
    };
    try {
      const getCategory = await categoryModel.findAndCountAll({
        like: query,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getCategory, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors.map((item) => item.message),
      });
    }
  }
  async getDetailCat(req, res) {
    const { category_id } = req.params;
    try {
      const getDetailCat = await categoryModel.findOne({
        where: {
          id: category_id,
        },
      });
      responseJSON({
        res,
        status: 200,
        data: getDetailCat,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors.map((item) => item.message),
      });
    }
  }
  async deleteCategory(req, res) {
    const { category_id } = req.params;
    try {
      const getDetailCat = await categoryModel.destroy({
        where: {
          id: category_id,
        },
      });
      responseJSON({
        res,
        status: 200,
        data: getDetailCat,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors.map((item) => item.message),
      });
    }
  }
  async editCategory(req, res) {
    const { category_id } = req.params;
    const { category_name } = req.body;
    try {
      const getDetailCat = await categoryModel.findOne({
        where: {
          id: category_id,
        },
      });

      getDetailCat.update({
        category_name,
      });

      responseJSON({
        res,
        status: 200,
        data: getDetailCat,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors.map((item) => item.message),
      });
    }
  }
  async addCategory(req, res) {
    const { category_name } = req.body;
    try {
      const result = await categoryModel.create({
        category_name,
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
        data: error.errors.map((item) => item.message),
      });
    }
  }
}

module.exports = new controllerCategory();
