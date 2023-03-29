const roomModel = require("../../models/room");
const facilityModel = require("../../models/facility");
const userModel = require("../../models/user");
const bookingModel = require("../../models/booking");
const roomDetailModel = require("../../models/room_detail");
const { general, paging } = require("../../../utils");
const { Op } = require("sequelize");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

const getOneDayTimeStamps = (date) => {
  let newDate = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000);

  return newDate;
};

class controllerRoom {
  async deleteRoom(req, res) {
    const { room_id } = req.params;
    try {
      const getDetailRoom = await roomModel.findOne({
        where: {
          id: room_id,
        },
      });

      getDetailRoom.update({
        visibility: false,
      });

      responseJSON({
        res,
        status: 200,
        data: getDetailRoom,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async editRoom(req, res) {
    const { room_id } = req.params;
    const {
      room_name,
      facilityId,
      gender = [],
      range_age,
      max_capacity,
      room_desc,
    } = req.body;
    try {
      const getDetailRoom = await roomModel.findOne({
        where: {
          id: room_id,
        },
      });

      getDetailRoom.update({
        room_name,
        facilityId,
        gender: JSON.stringify(gender),
        range_age,
        max_capacity,
        room_desc,
      });

      responseJSON({
        res,
        status: 200,
        data: getDetailRoom,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getDetailRoom(req, res) {
    const { room_id } = req.params;
    try {
      const result = await roomModel.findOne({
        where: {
          id: room_id,
        },
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getListRoom(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "room_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
      visibility: true,
    };
    try {
      const getListRoom = await roomModel.findAndCountAll({
        where: condition,
        include: [
          {
            model: facilityModel,
            as: "facility",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: userModel,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: bookingModel,
            as: "booking",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["visibility"],
        },
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const getDetailRoom = await roomDetailModel.findAll();

      const newList = {
        count: getListRoom.count,
        rows: getListRoom.rows.map((item) => ({
          ...item.dataValues,
          room_detail: getDetailRoom.filter(
            (filter) => filter.roomId == item.dataValues.id
          ),
        })),
      };

      responseJSON({
        res,
        status: 200,
        data: getPagingData(newList, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async createRoom(req, res) {
    const {
      room_name,
      facilityId,
      gender,
      range_age = [],
      max_capacity,
      room_desc,
      hostId,
    } = req.body;
    try {
      const result = await roomModel.create({
        room_name,
        facilityId,
        gender: gender,
        range_age: JSON.stringify(range_age),
        max_capacity,
        room_desc,
        hostId,
        room_expired: new Date(getOneDayTimeStamps(new Date())),
      });

      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
}

module.exports = new controllerRoom();
