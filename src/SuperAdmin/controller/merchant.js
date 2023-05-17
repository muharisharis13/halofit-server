const merchantModel = require("../../models/merchant");
const { general, paging } = require("../../../utils");

const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerMerchant {
  async getMerchant(req, res) {
    try {
      const getMerchant = await merchantModel.findAll({
        raw: true,
      });

      responseJSON({
        res: res,
        data: {
          user: getMerchant.map((item) => ({
            ...item,
          })),
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
