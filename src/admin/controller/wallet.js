const merchantModel = require("../../models/merchant");
const { general } = require("../../../utils");
const { responseJSON, hash } = general;
const historyModel = require("../../models/history_merchant");
const superadmin = require("../../models/SuperAdmin.js");

class walletController {
  async withdraw(req, res) {
    const { merchantId } = req.params;
    const { nominal } = req.body;

    try {
      const result = await merchantModel.findOne({
        where: {
          id: merchantId,
        },
      });
      const getsuperAdmin = await superadmin.findOne({
        where: {
          username: "admin",
        },
      });

      if (result) {
        await result.update({
          balance: parseInt(result.dataValues?.balance) - parseInt(nominal),
        });

        await historyModel.create({
          nominal: 0 - parseInt(nominal),
          merchantId,
        });

        const percentage = parseInt(nominal) * 0.05;

        await getsuperAdmin.update({
          balance:
            parseInt(getsuperAdmin.dataValues?.balance) + parseInt(percentage),
        });
      }

      responseJSON({
        res,
        status: 200,
        data: "Uang Berhasil di tarik",
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.message,
      });
    }
  }
}

module.exports = new walletController();
