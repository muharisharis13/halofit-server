const jwt = require("jsonwebtoken");
const { responseJSON } = require("./general");
const TokenUserModel = require("../src/models/token");
const UserModel = require("../src/models/user");

const secretToken = process.env.SECRET_TOKEN;
const secretTokenRefresh = process.env.SECRET_TOKEN_REFRESH;

const createToken = (data) => jwt.sign(data, secretToken);
const createRefreshToken = (data) => jwt.sign(data, secretTokenRefresh);

const isAuthenticationToken = async (req, res, next) => {
  try {
    const typeToken = req.headers.authorization.split(" ")[0];
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretToken);
    const { username, email, id } = decoded;

    if (typeToken !== "Bearer") {
      responseJSON({
        res,
        status: 401,
        data: "Type Authorization Cant Access !",
      });
    }

    try {
      const getTokenUser = await TokenUserModel.findOne({
        where: {
          userId: id,
        },
        raw: true,
      });

      if (getTokenUser) {
        const getUser = await UserModel.findOne({
          where: {
            username: username,
            email: email,
          },
          raw: true,
        });

        if (getUser) {
          next();
        }
      }
    } catch (error) {
      responseJSON({
        res,
        status: 400,
        data: error.message,
      });
    }
  } catch (error) {
    responseJSON({
      res,
      status: 401,
      data: error.message,
    });
  }
};

module.exports = {
  createToken,
  isAuthenticationToken,
  createRefreshToken,
};
