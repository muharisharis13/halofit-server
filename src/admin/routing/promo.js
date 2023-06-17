const express = require("express");
const router = express.Router();
const { multer } = require("../../../utils");
const controllerPromo = require("../controller/promo");

const { isAuthenticationTokenMerchant } = require("../../../utils/token");

router.get(
  "/:merchantId",
  isAuthenticationTokenMerchant,
  controllerPromo.getPromo
);
router.get(
  "/user/:merchantId",
  isAuthenticationTokenMerchant,
  controllerPromo.getUserPromo
);
router.get(
  "/detail/:idPromo",
  isAuthenticationTokenMerchant,
  controllerPromo.getDetailPromo
);
router.get(
  "/detail-user/:userPromoId",
  isAuthenticationTokenMerchant,
  controllerPromo.getDetailUserPromo
);
router.put(
  "/:idPromo",
  isAuthenticationTokenMerchant,
  multer.uploadBannerPromo.single("promo_img"),
  controllerPromo.updatePromo
);
router.put(
  "/detail/:id",
  isAuthenticationTokenMerchant,
  controllerPromo.updateDetailUserPromo
);
router.delete(
  "/:idPromo",
  isAuthenticationTokenMerchant,
  controllerPromo.deletePromo
);
router.post(
  "/",
  multer.uploadBannerPromo.single("promo_img"),
  isAuthenticationTokenMerchant,
  controllerPromo.createPromo
);

module.exports = router;
