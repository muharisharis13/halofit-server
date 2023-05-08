const express = require("express");
const router = express.Router();
const controllerMerchant = require("../controller/merchant");
const { isAuthenticationTokenMerchant } = require("../../../utils/token");

router.post("/feature", controllerMerchant.addFeature);
router.get("/time/:merchant_id", controllerMerchant.getListTimeOpenAndClose);
router.post("/time/:merchant_id", controllerMerchant.addTimeOpenAndClose);
router.get(
  "/",
  isAuthenticationTokenMerchant,
  controllerMerchant.getListMerchant
);
router.get(
  "/:merchantId",
  isAuthenticationTokenMerchant,
  controllerMerchant.getDetailMerchant
);

module.exports = router;
