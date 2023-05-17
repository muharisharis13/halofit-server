const merchantModel = require("../../models/merchant");
const { general, paging } = require("../../../utils");
const facilityModel = require("../../models/facility");
const categoryModel = require("../../models/category");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerMerchant {
  async getMerchant(req, res) {
    try {
      const getMerchant = await merchantModel.findAll({
        include: [
          {
            model: facilityModel,
            as: "facilities",
            attributes: ["categoryId", "facility_name"],
            include: [
              {
                model: categoryModel,
                as: "category",
              },
            ],
          },
        ],
      });

      responseJSON({
        res: res,
        data: {
          merchant: getMerchant,
        },
        status: 200,
      });
    } catch (error) {
      responseJSON({
        res: res,
        data: error.errors?.map((item) => item.message) || error,
        status: 500,
      });
    }
  }
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return [];
  }
}

module.exports = new controllerMerchant();
