const userModel = require("../../models/user");
const { Op } = require("sequelize");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerUser {
  async getuser(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "username",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = {
      [Op.or]: [
        {
          [column_name]: {
            [Op.like]: `%${query}%`,
          },
        },
        {
          username: {
            [Op.like]: `%${query}%`,
          },
        },
      ],
    };
    try {
      let getUser = await userModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["username", "DESC"]],
      });

      responseJSON({
        res: res,
        data: getPagingData(getUser, page, limit),
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
  async blockUser(req, res) {
    const { userId } = req.params;
    const { status } = req.body;
    try {
      await userModel
        .findOne({
          where: {
            id: userId,
          },
        })
        .then((result) => {
          if (result) {
            result.update({
              status,
            });
          }
        });
      responseJSON({
        res,
        status: 200,
        data: {
          status,
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

module.exports = new controllerUser();
