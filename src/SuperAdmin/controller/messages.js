const messageModel = require("../../models/messages");
const { general, paging } = require("../../../utils");

const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerMessages {
  async getMessage(req, res) {
    try {
      const getMessage = await messageModel.findAll({
        raw: true,
      });

      responseJSON({
        res: res,
        data: {
          user: getMessage.map((item) => ({
            ...item,
          })),
        },
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
