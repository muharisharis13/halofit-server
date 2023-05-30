const { Op } = require("sequelize");
const roomModel = require("../src/models/room")
const bookingModel = require("../src/models/booking")
const moment = require("moment")




const result = async () => {
  const currentDate = new Date();
  try {
    const result = await roomModel.update({
      where: {
        room_expired: {
          [Op.lt]: currentDate
        }
      }
    }, {
      show: false
    })

    const resultBooking = await bookingModel.update({
      where: {
        booking_date: {
          [Op.lte]: moment(currentDate).format("YYYY-MM-DD")
        }
      }
    },
      {
        visibility: 0
      })

    console.log({ result: result, resultBooking, date: moment(currentDate).format("YYYY-MM-DD") })
  } catch (error) {
    return error.message
  }
}

module.exports = result