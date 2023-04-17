const express = require("express");
const router = express.Router();
const controllerMerchant = require("../controller/merchant");
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.get(
  "/:merchantId",
  isAuthenticationToken,
  controllerMerchant.getDetailMerchant
);
router.get("/", isAuthenticationToken, controllerMerchant.getAllMerchant);

module.exports = router;
