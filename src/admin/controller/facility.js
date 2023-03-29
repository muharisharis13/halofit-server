const { general } = require("../../../utils");
const facilityModel = require("../../models/facility");

class controllerMerchant {
  async addFacility(req, res) {
    const { merchantId, facility_name, price, banner_img, categoryId } =
      req.body;
    try {
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors.map((item) => item.message),
      });
    }
  }
}

module.exports = new controllerMerchant();
