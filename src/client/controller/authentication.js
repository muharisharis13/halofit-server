const userModel = require("../../models/user");
const tokenModel = require("../../models/token");
const { general } = require("../../../utils");
const { createToken, createRefreshToken } = require("../../../utils/token");

const { responseJSON, hash } = general;

class controllerAuthentication {
  async setupNewPassword(req, res) {
    const { username, pin, newPassword } = req.body;
    try {
      const getUser = await userModel.findOne({
        where: {
          username,
          pin: hash(pin),
        },
        attributes: {
          exclude: ["password", "pin"],
        },
      });
      getUser.update({
        password: hash(newPassword),
      });

      responseJSON({
        res,
        status: 200,
        data: getUser,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async verifyAccountByPin(req, res) {
    const { username, pin } = req.body;
    try {
      const getUser = await userModel.findOne({
        where: {
          username,
          pin: hash(pin),
        },
        attributes: {
          exclude: ["password", "pin"],
        },
      });

      responseJSON({
        res,
        status: 200,
        data: getUser,
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const getUser = await userModel.findOne({
        where: {
          username,
          password: hash(password),
        },
        attributes: {
          exclude: ["password", "pin"],
        },
        raw: true,
      });

      const token = createToken({ ...getUser });
      const refreshToken = createRefreshToken({ ...getUser });

      const getToken = await tokenModel.findOne({
        where: {
          userId: getUser.id,
        },
      });

      if (!getToken) {
        await tokenModel.create({
          userId: getUser.id,
          token,
          refreshToken,
        });
      } else {
        await getToken.update({
          token,
          refreshToken,
        });
      }

      responseJSON({
        res,
        status: 200,
        data: {
          data: getUser,
          type: "Bearer",
          token,
          refreshToken,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error,
      });
    }
  }

  async register(req, res) {
    const { username, email, password, gender, pin } = req.body;
    try {
      const result = await userModel.create({
        username,
        email,
        password: hash(password),
        phone_number: "",
        gender: "",
        pin: hash(pin),
        balance: 0,
      });

      const getUser = await userModel.findOne({
        where: {
          id: result.id,
        },
        attributes: {
          exclude: ["password", "pin"],
        },
      });

      const token = createToken({ ...result });
      const refreshToken = createRefreshToken({ ...result });

      const getToken = await tokenModel.findOne({
        where: {
          userId: result.id,
        },
      });

      if (!getToken) {
        await tokenModel.create({
          userId: result.id,
          token,
          refreshToken,
        });
      } else {
        await getToken.update({
          token,
          refreshToken,
        });
      }

      responseJSON({
        res,
        status: 200,
        data: {
          data: getUser,
          type: "Bearer",
          token,
          refreshToken,
        },
      });
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.errors?.map((item) => item.message),
      });
    }
  }
  async getlistUser(req, res) {
    try {
      const data = await userModel.findAll();

      responseJSON({
        res,
        status: 200,
        data: data,
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

module.exports = new controllerAuthentication();
