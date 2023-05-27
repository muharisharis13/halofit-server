const { responseJSON } = require("../../../utils/general");
const bannerModel = require("../../models/banner");
const { general, paging, url } = require("../../../utils");
const { fullURL } = url;
const { pathBanner } = require("../../../utils/url");

class controllerBanner {
  async addBanner(req, res) {
    try {
      if (req.file) {
        const result = await bannerModel.create({
          banner_img: `${fullURL(req)}${pathBanner}/${req.file.filename}`,
        });
        responseJSON({
          res,
          status: 200,
          data: result,
        });
      } else {
        responseJSON({
          res,
          status: 400,
          data: "File Must Be Upload",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message),
      });
    }
  }

  async getBanner(req, res) {
    try {
      const getBanner = await bannerModel.findOne();

      responseJSON({
        res,
        status: 200,
        data: {
          banner: getBanner,
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

  async deleteBanner(req, res) {
    const { id } = req.body;

    try {
      const deleteBanner = await bannerModel.destroy({
        where: {
          id,
        },
      });
      responseJSON({
        res,
        status: 200,
        data: {
          banner_info: deleteBanner,
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

module.exports = new controllerBanner();
