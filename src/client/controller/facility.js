const facilityModel = require("../../models/facility");
const merchantModel = require("../../models/merchant");
const bookingModel = require("../../models/booking");
const categoryModel = require("../../models/category");
const { general, paging, url } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { fullURL } = url;
const { Op } = require("sequelize");
const { pathBanner } = require("../../../utils/url");

const getListTIme = (time) => {
  if (time[0]) {
    const getOpenTime = time[0].split(":")[0].split("0")[1];
    let arrTime = [];

    console.log(getOpenTime);
    for (let i = 0; i <= getOpenTime; i++) {
      arrTime.push(parseInt(getOpenTime) + parseInt(i));
    }

    arrTime = arrTime.map((item) => (item < 10 ? `0${item}:00` : `${item}:00`));

    return arrTime;
  } else {
    return [];
  }
};

const getFullDate = () => {
  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  return `${year}-${month < 10 ? `0${month}` : month}-${
    date < 10 ? `0${date}` : date
  }`;
};

class controllerFacility {
  async getTimePlay(req, res) {
    const { facilityId } = req.params;
    const { merchantId, userId } = req.body;
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
        },
        raw: true,
      });

      const newGetBooking = getBooking.map((item) => ({
        ...item,
        time: JSON.parse(item?.time) || [],
      }));

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
        list_time: data.list_time?.map((item) => ({
          time: item,
          available:
            newGetBooking.filter((filter) => filter.time[0] === item &&).length ===
            1
              ? false
              : true,
        })),
        getBooking: newGetBooking,
        getFullDate: getFullDate(),
      };

      responseJSON({
        res,
        status: 200,
        data: newData,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async getListFacility(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "",
      query = "",
      order_field,
      order = "ASC",
    } = req.query;

    const new_column_name = column_name ? JSON.parse(column_name) : "";
    const new_query = query
      ? JSON.parse(query).map((item, idx) => ({
          key: new_column_name[idx],
          value: item,
        }))
      : "";
    const { limit, offset } = getPagination(page, size);
    // const condition = {
    //   [`$${column_name}$`]: {
    //     [Op.like]: `%${query ?? ""}%`,
    //   },
    // };

    const condition2 = new_column_name
      ? new_column_name.reduce(
          (a, v) => ({
            ...a,
            [`$${v}$`]: {
              [Op.like]: `%${
                new_query.find((find) => find.key === v)?.value ?? ""
              }%`,
            },
          }),
          {}
        )
      : "";

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
        where: condition2,
        limit,
        offset,
        order: [
          ["id", "DESC"],
          [order_field, order],
        ],
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
