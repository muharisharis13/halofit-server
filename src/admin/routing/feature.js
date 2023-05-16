const express = require("express");
const router = express.Router();
const controllerFeature = require("../controller/feature");
const { isAuthenticationTokenMerchant } = require("../../../utils/token");

router.get(
  "/",
  isAuthenticationTokenMerchant,
  controllerFeature.getListFeature
);

router.put(
  "/update",
  isAuthenticationTokenMerchant,
  controllerFeature.updateFeature
);

module.exports = router;
