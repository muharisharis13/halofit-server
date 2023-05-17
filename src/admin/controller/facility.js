const { Op } = require("sequelize");
const { general } = require("../../../utils");
const { responseJSON } = require("../../../utils/general");
const { getPagination, getPagingData } = require("../../../utils/paging");
const facilityModel = require("../../models/facility");

class controllerMerchant {
  async getListFacility(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "facility_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);

    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
    };
    try {
      const getFacility = await facilityModel.findAndCountAll({
        like: query,
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getFacility, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
  async addFacility(req, res) {
    const { merchantId, facility_name, price, categoryId, time } = req.body;

    try {
      if (req.file) {
        const result = await facilityModel.create({
          merchantId,
          facility_name,
          // banner_img: `${fullURL(req)}${pathBanner}/${req.file.filename}`,
          banner_img: req.file.filename,
          price,
          categoryId,
          time,
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
}

module.exports = new controllerMerchant();
