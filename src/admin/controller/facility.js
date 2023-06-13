const { Op } = require("sequelize");
const { general } = require("../../../utils");
const { responseJSON } = require("../../../utils/general");
const { getPagination, getPagingData } = require("../../../utils/paging");
const facilityModel = require("../../models/facility");
const bookingModel = require("../../models/booking");
const userModel = require("../../models/user");

const getListTIme = (time) => {
  if (time[0]) {
    const getOpenTime = time[0].split(":")[0].split("0")[1];
    let arrTime = [];

    for (let i = 0; i <= getOpenTime; i++) {
      arrTime.push(parseInt(getOpenTime) + parseInt(i));
    }

    arrTime = arrTime.map((item) => (item < 10 ? `0${item}:00` : `${item}:00`));

    return arrTime;
  } else {
    return [];
  }
};

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

  async getBookingFacility(req, res) {
    const { merchantId } = req.params;
    try {
      const getFacility = await facilityModel.findAll({
        where: {
          merchantId,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: getFacility,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getTimePlay(req, res) {
    const { facilityId } = req.params;
    const { merchantId, selected_date } = req.body;
    try {
      const resultFacility = await facilityModel.findOne({
        where: {
          merchantId,
          id: facilityId,
        },
      });

      const getBooking = await bookingModel.findAll({
        where: {
          facilityId,
          booking_date: selected_date,
          show: 1,
        },
        include: [
          {
            model: userModel,
            as: "user",
            attributes: ["username", "phone_number"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const timeBooking = getBooking
        ? getBooking.map((item) => JSON.parse(item.time))
        : [];

      const letNewTime = timeBooking.reduce((acc, val) => acc.concat(val), []);

      const data = {
        ...resultFacility.dataValues,
        time: resultFacility.dataValues.time
          ? JSON.parse(resultFacility.dataValues.time)
          : [],
        list_time: resultFacility.dataValues.time
          ? getListTIme(JSON.parse(resultFacility.dataValues.time))
          : [],
      };

      const newData = {
        ...data,
        list_time: data.list_time?.map((item) => {
          const isBooked = letNewTime.includes(item);
          const booking = getBooking.find((booking) =>
            JSON.parse(booking.time).includes(item)
          );
          return {
            time: item,
            available: !isBooked,
            ...(isBooked &&
              booking && {
                username: booking.user?.username,
                phone_number: booking.user?.phone_number,
              }),
          };
        }),
      };

      console.log({ letNewTime });

      responseJSON({
        res,
        status: 200,
        data: newData,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
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
