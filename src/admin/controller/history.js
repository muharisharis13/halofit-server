const historyModel = require("../../models/history_merchant");
const { general, paging, url } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerHistory {
  async getHistory(req, res) {
    const { size = 15, page = 1 } = req.query;
    const { limit, offset } = getPagination(page, size);
    const { merchantId } = req.params;
    try {
      const result = await historyModel.findAll({
        where: {
          merchantId,
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
      responseJSON({
        res,
        status: 200,
        data: result,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 200,
        data: error.message,
      });
    }
  }
}

module.exports = new controllerHistory();
