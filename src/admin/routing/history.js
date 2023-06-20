const express = require("express");
const router = express.Router();
const controllerHistory = require("../controller/history");
const { isAuthenticationTokenMerchant } = require("../../../utils/token");

router.get(
  "/:merchantId",
  isAuthenticationTokenMerchant,
  controllerHistory.getHistory
);

module.exports = router;
