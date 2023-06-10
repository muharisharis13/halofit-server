const express = require("express");
const router = express.Router();
const { isAuthenticationTokenMerchant } = require("../../../utils/token");
const controllerWallet = require("../controller/wallet");

router.put(
  "/withdraw/:merchantId",
  isAuthenticationTokenMerchant,
  controllerWallet.withdraw
);

module.exports = router;
