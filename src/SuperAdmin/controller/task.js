const taskModel = require("../../models/task");
const { Op } = require("sequelize");
const merchantModel = require("../../models/merchant");
const { general, paging, url } = require("../../../utils");
const taskDetailModel = require("../../models/task_detail");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const {
  pathProfile,
  pathPromo,
  pathBannerTask,
  pathBanner,
} = require("../../../utils/url");
const { fullURL } = url;

class controllerTask {
  async getTask(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "task_name",
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
          task_name: {
            [Op.like]: `%${query}%`,
          },
        },
      ],
    };
    try {
      const getTask = await taskModel.findAndCountAll({
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: ["id", "email", "merchant_name", "address"],
          },
        ],
        where: condition,
        limit,
        offset,
        order: [["task_name", "DESC"]],
      });

      const newData = {
        count: getTask.count,
        rows: getTask.rows.map((item) => ({
          ...item.dataValues,
          banner_img: `${fullURL(req)}${pathBannerTask}/${
            item.dataValues?.banner_img
          }`,
        })),
      };

      responseJSON({
        res,
        status: 200,
        data: {
          task_info: getPagingData(newData, page, limit),
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

module.exports = new controllerTask();
