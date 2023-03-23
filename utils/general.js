const httpStatus = require("http-status");
const crypto = require("crypto");

class general {
  hash(data) {
    if (data) {
      return crypto.createHash("md5").update(data).digest("hex");
    }
    return;
  }
  responseJSON({ res, data, status = 400 }) {
    return res.status(status).json({
      message: httpStatus[status],
      data,
    });
  }
}

module.exports = new general();
