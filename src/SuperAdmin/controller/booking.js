const bookingModel = require("../../models/booking");
const userModel = require("../../models/user");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const facilityModel = require("../../models/facility");
const { getPagination, getPagingData } = paging;

class controllerBooking {
  async getBooking(req, res) {
    try {
      const getBooking = await bookingModel.findAll({
        include: [
          {
            model: userModel,
            as: "user",
            attributes: ["username", "email", "gender", "point"],
            model: facilityModel,
            as: "facility",
            attributes: ["facility_name"],
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          booking: getBooking,
        },
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

module.exports = new controllerBooking();
