const facilityModel = require("../../models/facility");
const merchantModel = require("../../models/merchant");
const merchantTimeModel = require("../../models/merchant_time");
const categoryModel = require("../../models/category");
const { general, paging, url } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { fullURL } = url;
const { Op } = require("sequelize");
const { pathBanner } = require("../../../utils/url");

class controllerFacility {
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
      const getListFacility = await facilityModel.findAndCountAll({
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: categoryModel,
            as: "category",

            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getListFacility, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async createFacility(req, res) {
    const { merchantId, facility_name, banner_img, price, categoryId, time } =
      req.body;

    try {
      if (req.file) {
        const result = await facilityModel.create({
          merchantId,
          facility_name,
          banner_img: `${fullURL(req)}${pathBanner}/${req.file.filename}`,
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

module.exports = new controllerFacility();
