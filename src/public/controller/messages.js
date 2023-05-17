const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const messageModel = require("../../models/messages");

class controllerMessages {
  async addMessage(req, res) {
    const { name, message, email } = req.body;

    try {
      const result = await messageModel.create({
        name,
        message,
        email,
      });

      responseJSON({
        res,
        status: 200,
        data: {
          message_info: result.dataValues,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error.message,
      });
    }
  }
}

module.exports = new controllerMessages();
