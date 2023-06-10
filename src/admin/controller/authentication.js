const { general } = require("../../../utils");
const merchanModel = require("../../models/merchant");
const tokenAdmin = require("../../models/token_admin");
const { createToken, createRefreshToken } = require("../../../utils/token");

const { responseJSON, hash } = general;

class controllerAuthentication {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const getMerchant = await merchanModel.findOne({
        where: {
          email,
          status: "approved",
          password: hash(password),
        },
        attributes: {
          exclude: ["password"],
        },
        raw: true,
      });
      const token = createToken({ ...getMerchant });
      const refreshToken = createRefreshToken({ ...getMerchant });

      const getTokenMerchant = await tokenAdmin.findOne({
        where: {
          adminid: getMerchant.id,
        },
      });

      if (!getTokenMerchant) {
        await tokenAdmin.create({
          adminId: getMerchant.id,
          token,
          refreshToken,
        });
      } else {
        await getTokenMerchant.update({
          token,
          refreshToken,
        });
      }

      responseJSON({
        res,
        status: 200,
        data: {
          data: getMerchant,
          type: "Bearer",
          token,
          refreshToken,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors?.map((item) => item.message) || error,
      });
    }
  }
  async register(req, res) {
    const {
      password,
      email,
      merchant_name,
      address,
      desc,
      pin,
      status = "approved",
    } = req.body;
    try {
      const result = await merchanModel.create({
        email,
        password: hash(password),
        merchant_name,
        address,
        desc,
        pin: hash(pin),
        status,
      });

      const getMerchant = await merchanModel.findOne({
        where: {
          id: result.id,
        },
        attributes: {
          exclude: ["password", "pin"],
        },
      });

      const token = createToken({ ...result });
      const refreshToken = createRefreshToken({ ...result });

      const getTokenMerchant = await tokenAdmin.findOne({
        where: {
          adminid: result.id,
        },
      });

      if (!getTokenMerchant) {
        await tokenAdmin.create({
          adminId: result.id,
          token,
          refreshToken,
        });
      } else {
        await getTokenMerchant.update({
          token,
          refreshToken,
        });
      }

      responseJSON({
        res,
        status: 200,
        data: {
          data: getMerchant,
          type: "Bearer",
          token,
          refreshToken,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 500,
        data: error.errors.map((item) => item.message),
      });
    }
  }

  async setupNewPassword(req, res) {
    const { email, pin, newPassword } = req.body;
    try {
      const getMerchant = await merchanModel.findOne({
        where: {
          email,
          pin: hash(pin),
        },
      });

      if (getMerchant) {
        getMerchant.update({
          password: hash(newPassword),
        });
        responseJSON({
          res,
          status: 200,
          data: getMerchant,
        });
      } else {
        responseJSON({
          res,
          status: 400,
          data: ["Incorrect email or pin"],
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }

  async verifyAccountByPin(req, res) {
    const { email, pin } = req.body;
    try {
      const getMerchant = await merchanModel.findOne({
        where: {
          email,
          pin: hash(pin),
        },
        attributes: {
          exclude: ["password", "pin"],
        },
      });

      if (getMerchant) {
        responseJSON({
          res,
          status: 200,
          data: getMerchant,
        });
      } else {
        responseJSON({
          res,
          status: 400,
          data: ["Incorrect email or pin"],
        });
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message) || [
          "An error occurred",
        ],
      });
    }
  }
}

module.exports = new controllerAuthentication();
