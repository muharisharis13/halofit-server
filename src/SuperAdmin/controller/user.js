const userModel = require("../../models/user");
const { general, paging } = require("../../../utils");

const { responseJSON } = general;
const { getPagination, getPagingData } = paging;

class controllerUser {
  async getuser(req, res) {
    try {
      const getUser = await userModel.findAll({
        raw: true,
      });

      responseJSON({
        res: res,
        data: {
          user: getUser.map((item) => ({
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

module.exports = new controllerUser();
