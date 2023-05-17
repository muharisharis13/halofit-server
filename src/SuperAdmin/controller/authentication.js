const { general } = require("../../../utils");
const AdminModel = require("../../models/SuperAdmin");
const tokenSuperAdmin = require("../../models/token_superadmin");
const { createToken, createRefreshToken } = require("../../../utils/token");

const { responseJSON, hash } = general;

class controllerAuthentication {
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const getAdmin = await AdminModel.findOne({
        where: {
          email,
          password: hash(password),
        },
        attributes: {
          exclude: ["password"],
        },
        raw: true,
      });
      const token = createToken({ ...getAdmin });
      const refreshToken = createRefreshToken({ ...getAdmin });

      const getTokenAdmin = await tokenSuperAdmin.findOne({
        where: {
          SuperAdminId: getAdmin.id,
        },
      });

      if (!getTokenAdmin) {
        await tokenSuperAdmin.create({
          SuperAdminId: getAdmin.id,
          token,
          refreshToken,
        });
      } else {
        await getTokenAdmin.update({
          token,
          refreshToken,
        });
      }

      responseJSON({
        res,
        status: 200,
        data: {
          data: getAdmin,
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
    const { password, email, username } = req.body;
    try {
      const result = await AdminModel.create({
        email,
        password: hash(password),
        username,
      });

      const getAdmin = await AdminModel.findOne({
        where: {
          id: result.id,
        },
        attributes: {
          exclude: ["password", "pin"],
        },
      });

      const token = createToken({ ...result });
      const refreshToken = createRefreshToken({ ...result });

      const getTokenAdmin = await tokenSuperAdmin.findOne({
        where: {
          SuperAdminId: result.id,
        },
      });

      if (!getTokenAdmin) {
        await tokenSuperAdmin.create({
          SuperAdminId: result.id,
          token,
          refreshToken,
        });
      } else {
        await getTokenAdmin.update({
          token,
          refreshToken,
        });
      }

      responseJSON({
        res,
        status: 200,
        data: {
          data: getAdmin,
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
}

module.exports = new controllerAuthentication();
