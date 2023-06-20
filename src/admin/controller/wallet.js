const merchantModel = require("../../models/merchant");
const { general } = require("../../../utils");
const { responseJSON, hash } = general;
const historyModel = require("../../models/history_merchant");

class walletController {
  async withdraw(req, res) {
    const { merchantId } = req.params;
    const { nominal } = req.body;

    try {
      await merchantModel
        .findOne({
          where: {
            id: merchantId,
          },
        })
        .then((result) => {
          if (result) {
            result.update({
              balance: parseInt(result.dataValues?.balance) - parseInt(nominal),
            });
            historyModel.create({
              nominal: 0 - parseInt(nominal),
              merchantId,
            });
          }
        });
      responseJSON({
        res,
        status: 200,
        data: "Uang Berhasil di tarik",
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

module.exports = new walletController();
