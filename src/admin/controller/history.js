const historyModel = require("../../models/history_merchant");
const { general } = require("../../../utils");
const { responseJSON, hash } = general;

class controllerHistory {
  async getHistory(req, res) {
    const { merchantId } = req.params;
    try {
      const result = await historyModel.findAll({
        where: {
          merchantId,
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
        status: 200,
        data: error.message,
      });
    }
  }
}

module.exports = new controllerHistory();
