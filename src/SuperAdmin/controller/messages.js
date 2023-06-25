const messageModel = require("../../models/messages");
const { general, paging } = require("../../../utils");
const { Op } = require("sequelize");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerMessages {
  async getMessage(req, res) {
    const { page = 1, size = 10, column_name = "name", query = "" } = req.query;
    const condition = {
      [Op.or]: [
        {
          [column_name]: {
            [Op.like]: `%${query}%`,
          },
        },
        {
          name: {
            [Op.like]: `%${query}%`,
          },
        },
      ],
    };
    const { limit, offset } = getPagination(page, size);
    try {
      const getMessage = await messageModel.findAndCountAll({
        raw: true,
        where: condition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      responseJSON({
        res: res,
        data: getPagingData(getMessage, page, limit),
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

module.exports = new controllerMessages();
