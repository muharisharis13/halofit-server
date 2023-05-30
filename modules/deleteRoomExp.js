const { Op } = require("sequelize");
const roomModel = require("../src/models/room")
const bookingModel = require("../src/models/booking")
const moment = require("moment")




const result = async () => {
  const currentDate = new Date();
  try {
    const result = await roomModel.destroy({
      where: {
        room_expired: {
          [Op.lt]: currentDate
        }
      }
    })

    const resultBooking = await bookingModel.destroy({
      where: {
        booking_date: {
          [Op.lte]: moment(currentDate).format("YYYY-MM-DD")
        }
      }
    })

    console.log({ result: result, resultBooking, date: moment(currentDate).format("YYYY-MM-DD") })
  } catch (error) {
    return error.message
  }
}

module.exports = result