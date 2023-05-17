const bookingModel = require("../../models/booking");
const userModel = require("../../models/user");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
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
          },
        ],
      });

      responseJSON({
        res,
        status: 200,
        data: {
          task_info: getBooking,
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
