const userModel = require("../../models/user");
const { general } = require("../../../utils");
const { responseJSON } = general;

class controllerUser {
  async getDetailUser(req, res) {
    const { user_id } = req.params;
    try {
      const result = await userModel.findOne({
        where: {
          id: user_id,
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
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
}

module.exports = new controllerUser();
