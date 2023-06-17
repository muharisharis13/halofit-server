const express = require("express");
const router = express.Router();
const controllerMerchant = require("../controller/merchant");
const { isAuthenticationTokenMerchant } = require("../../../utils/token");
const { multer } = require("../../../utils");

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
router.put(
  "/:merchantId",
  isAuthenticationTokenMerchant,
  multer.uploadBannerMerchant.single("banner_img"),
  controllerMerchant.editMerchant
);
router.put(
  "/time/open-close",
  isAuthenticationTokenMerchant,
  controllerMerchant.updateMerchantTime
);

module.exports = router;
