const merchantModel = require("../../models/merchant");
const merchantTimeModel = require("../../models/merchant_time");
const merchantFeatureModel = require("../../models/merchant_feature");
const { general, paging } = require("../../../utils");
const { responseJSON } = general;
const { getPagination, getPagingData } = paging;
const { Op } = require("sequelize");
const featureModel = require("../../models/feature");
const facilityModel = require("../../models/facility");
const categoryModel = require("../../models/category");
const { fullURL, pathMerchant, pathBanner } = require("../../../utils/url");

class controllerMerchant {
  async updateMerchantTime(req, res) {
    const { merchantId, day_name, open, close } = req.body;
    try {
      const findMerchantTime = await merchantTimeModel.findOne({
        where: {
          merchantId,
        },
      });

      if (findMerchantTime[day_name] && open && close) {
        findMerchantTime.update({
          [day_name]: "",
        });
        responseJSON({
          res,
          status: 200,
          data: findMerchantTime,
        });
      } else {
        findMerchantTime.update({
          [day_name]: JSON.stringify([open, close]),
        });
        responseJSON({
          res,
          status: 200,
          data: findMerchantTime,
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
  async editMerchant(req, res) {
    const { merchantId } = req.params;
    const {
      merchant_name,
      address,
      desc,
      merchant_feature = [],
      merchant_time,
    } = req.body;
    console.log("req body", JSON.parse(req.body?.merchant_feature));
    try {
      await merchantModel
        .findOne({
          where: {
            id: merchantId,
          },
        })
        .then(async (result) => {
          if (result) {
            if (req.file?.filename) {
              result.update({
                img_merchant: req.file?.filename,
              });
            }
            result.update({
              merchant_name,
              address,
              desc,
            });

            if (!merchant_feature)
              throw Error(
                "Something Error with merchant_feature must be parse to stringify or null"
              );

            //parse dari string ke json
            const parseMerchantFeature = JSON.parse(merchant_feature);

            const getAllmerchantFeature = await merchantFeatureModel.findAll({
              where: {
                merchantId,
              },
            });

            //proses hapus atau menambahkan feature
            function filterDataWithoutFriend() {
              const friendIds = parseMerchantFeature.map((item) => item.id);

              const filteredData = getAllmerchantFeature.filter(
                (item) => !friendIds.includes(item.dataValues?.featureId)
              );

              return filteredData;
            }
            const filteredData = filterDataWithoutFriend()?.map(
              (item) => item.dataValues
            );

            console.log({
              filteredData: filteredData,
            });

            if (filteredData.length > 0) {
              //menghapus feature jika ada
              filteredData.map(async (item) => {
                await merchantFeatureModel
                  .findOne({
                    where: {
                      merchantId: item?.merchantId,
                      featureId: item?.featureId,
                    },
                  })
                  .then((result) => {
                    result.destroy();
                  });
              });
            } else {
              parseMerchantFeature.map(async (item) => {
                await merchantFeatureModel
                  .findOne({
                    where: {
                      featureId: item?.id,
                      merchantId: merchantId,
                    },
                  })
                  .then(async (result) => {
                    if (!result) {
                      console.log("gak ada", item);
                      await merchantFeatureModel.create({
                        merchantId,
                        featureId: item?.id,
                      });
                    }
                  });
              });
            }
            //==========================//==========================

            if (!merchant_time) throw Error("merchant_time must be include");
            let parseMerchantTime = JSON.parse(merchant_time);

            for (const item in parseMerchantTime) {
              if (
                item == "id" ||
                item == "merchantId" ||
                item == "createdAt" ||
                item == "updatedAt"
              ) {
                delete parseMerchantTime[item];
              }

              parseMerchantTime = parseMerchantTime;
            }

            console.log({ parseMerchantTime });

            const getAllMerchantTime = await merchantTimeModel.findOne({
              where: {
                merchantId,
              },
              // raw: true,
            });
            const getFacility = await facilityModel.findOne({
              where: {
                merchantId,
              },
            });

            const updatedTime = Object.entries(parseMerchantTime).find(
              ([day, time]) => time !== ""
            );
            const [day, time] = updatedTime;

            await facilityModel.update(
              { time: JSON.stringify(time) },
              { where: { merchantId } }
            );

            if (!getAllMerchantTime) throw Error("Merchant Time Not Found");

            for (const item in parseMerchantTime) {
              await getAllMerchantTime.update({
                [item]: JSON.stringify(parseMerchantTime[item]),
              });
              // await facilityModel.update(
              //   { time: JSON.stringify(parseMerchantTime[item]) },
              //   { where: { merchantId } }
              // );
              // console.log({ datanya: parseMerchantTime[item] });
            }

            responseJSON({
              res,
              status: 200,
              data: "Successfully edit merchant",
            });
          } else {
            throw Error("Merchant Not Found");
          }
        });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.message,
      });
    }
  }
  async addFeature(req, res) {
    const { merchantId = 2, featureId = 1 } = req.body;
    try {
      const checkDuplicate = await merchantFeatureModel.findOne({
        where: {
          featureId,
        },
        raw: true,
      });

      if (!checkDuplicate) {
        const result = await merchantFeatureModel.create({
          merchantId,
          featureId,
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
          data: "Prasarana Sudah Di Ada",
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }
  async getListTimeOpenAndClose(req, res) {
    const { merchant_id } = req.params;
    try {
      const result = await merchantTimeModel.findOne({
        where: {
          merchantId: merchant_id,
        },
        include: [
          {
            model: merchantModel,
            as: "merchant",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
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
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }
  async addTimeOpenAndClose(req, res) {
    const { merchant_id } = req.params;
    const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
      req.body;
    try {
      const result = await merchantTimeModel.create({
        merchantId: merchant_id,
        sunday: JSON.stringify(sunday),
        monday: JSON.stringify(monday),
        tuesday: JSON.stringify(tuesday),
        wednesday: JSON.stringify(wednesday),
        thursday: JSON.stringify(thursday),
        friday: JSON.stringify(friday),
        saturday: JSON.stringify(saturday),
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
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }
  async getListMerchant(req, res) {
    const {
      page = 1,
      size = 10,
      column_name = "merchant_name",
      query = "",
    } = req.query;
    const { limit, offset } = getPagination(page, size);

    const condition = {
      [`$${column_name}$`]: {
        [Op.like]: `%${query ?? ""}%`,
      },
    };
    try {
      const getMerchant = await merchantModel.findAndCountAll({
        where: condition,
        limit,
        offset,
        order: [["id", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
      });

      responseJSON({
        res,
        status: 200,
        data: getPagingData(getMerchant, page, limit),
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error?.errors?.map((item) => item.message) || error,
      });
    }
  }

  async getDetailMerchant(req, res) {
    const { merchantId } = req.params;
    try {
      const result = await merchantModel.findOne({
        where: {
          id: merchantId,
        },
        attributes: {
          exclude: ["password"],
        },
      });

      console.log({ ini_result: result });

      if (!result) {
        responseJSON({
          res,
          status: 400,
          data: "Merchant Tidak ditemukan !",
        });
      } else {
        const getMerchantFeature = await merchantFeatureModel.findAll({
          where: {
            merchantId: result?.dataValues?.id,
          },
          include: [
            {
              model: featureModel,
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
        });

        const getMerchantTime = await merchantTimeModel.findOne({
          where: {
            merchantId: result?.dataValues?.id,
          },
        });

        const getFacility = await facilityModel.findAll({
          where: {
            merchantId: result?.dataValues?.id,
          },
          include: [
            {
              model: categoryModel,
            },
          ],
        });

        const category = await categoryModel.findAll();

        const newCategory = category.map((item) => ({
          ...item.dataValues,
          facility: getFacility
            .filter(
              (filter) => filter.dataValues?.categoryId == item?.dataValues.id
            )
            .map((item2) => ({
              ...item2.dataValues,
              banner_img: `${fullURL(req)}${pathBanner}/${
                item2?.dataValues?.banner_img
              }`,
            })),
        }));

        responseJSON({
          res,
          status: 200,
          data: {
            merchant_info: {
              ...result.dataValues,
              img_merchant: `${fullURL(req)}${pathMerchant}/${
                result.dataValues?.img_merchant
              }`,
            },
            feature_merchant: getMerchantFeature,
            merchant_time: getMerchantTime
              ? {
                  ...getMerchantTime.dataValues,
                  sunday:
                    getMerchantTime.dataValues.sunday &&
                    JSON.parse(getMerchantTime.dataValues.sunday),
                  monday:
                    getMerchantTime.dataValues.monday &&
                    JSON.parse(getMerchantTime.dataValues.monday),
                  tuesday:
                    getMerchantTime.dataValues.tuesday &&
                    JSON.parse(getMerchantTime.dataValues.tuesday),
                  wednesday:
                    getMerchantTime.dataValues.wednesday &&
                    JSON.parse(getMerchantTime.dataValues.wednesday),
                  thursday:
                    getMerchantTime.dataValues.thursday &&
                    JSON.parse(getMerchantTime.dataValues.thursday),
                  friday:
                    getMerchantTime.dataValues.friday &&
                    JSON.parse(getMerchantTime.dataValues.friday),
                  saturday:
                    getMerchantTime.dataValues.saturday &&
                    JSON.parse(getMerchantTime.dataValues.saturday),
                }
              : null,
            merchant_info: {
              ...result.dataValues,
              img_merchant: `${fullURL(req)}${pathMerchant}/${
                result.dataValues?.img_merchant
              }`,
            },
            facility: getFacility,
            category_facility: newCategory,
          },
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.message,
      });
    }
  }
}

module.exports = new controllerMerchant();
