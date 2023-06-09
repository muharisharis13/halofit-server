const userModel = require("../../models/user");
const multer = require("multer");
const { general } = require("../../../utils");
const { responseJSON } = general;
const { paging, url } = require("../../../utils");
const { pathProfile } = require("../../../utils/url");
const { fullURL } = url;

class controllerUser {
  async getDetailUser(req, res) {
    const { userId } = req.params;
    try {
      const result = await userModel.findOne({
        where: {
          id: userId,
        },
        attributes: {
          exclude: ["pin", "password"],
        },
      });

      responseJSON({
        res,
        status: 200,
        data: {
          user_info: {
            ...result.dataValues,
            profile_img: `${fullURL(req)}${pathProfile}/${
              result.dataValues?.profile_img
            }`,
          },
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async updateUser(req, res) {
    const { userId } = req.params;
    const { username, gender, age, phone_number, bio } = req.body;

    try {
      if (!req.file) {
        return responseJSON({
          res,
          status: 400,
          data: "File must be uploaded!",
        });
      }
      let user = await userModel.findOne({
        where: {
          id: userId,
        },
      });
      if (req.file?.filename) {
        user.update({
          profile_img: req.file.filename,
        });
      }
      user.update({
        username,
        gender,
        age,
        phone_number,
        bio,
      });

      responseJSON({
        res,
        status: 200,
        data: "Profile data updated",
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
}

module.exports = new controllerUser();
