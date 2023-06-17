const express = require("express");
const router = express.Router();
const controllerFacility = require("../controller/facility");
const { isAuthenticationTokenMerchant } = require("../../../utils/token");
const { uploadBannner } = require("../../../utils/multer");

router.post(
  "/",
  isAuthenticationTokenMerchant,
  uploadBannner.single("banner_img"),
  controllerFacility.addFacility
);

router.get(
  "/",
  isAuthenticationTokenMerchant,
  controllerFacility.getListFacility
);
router.post(
  "/time/:facilityId",
  isAuthenticationTokenMerchant,
  controllerFacility.getTimePlay
);
router.get(
  "/:merchantId",
  isAuthenticationTokenMerchant,
  controllerFacility.getBookingFacility
);
router.get(
  "/detail/:facilityId",
  isAuthenticationTokenMerchant,
  controllerFacility.getDetailFacility
);
router.put(
  "/detail/:facilityId",
  isAuthenticationTokenMerchant,
  uploadBannner.single("banner_img"),
  controllerFacility.EditFacility
);
router.delete(
  "/:facilityId",
  isAuthenticationTokenMerchant,
  controllerFacility.deleteFacility
);

module.exports = router;
