const express = require("express");
const router = express.Router();
const controllerFacility = require("../controller/facility");
const { multer } = require("../../../utils");
const { uploadBannner } = multer;
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.post(
  "/",
  isAuthenticationToken,
  uploadBannner.single("banner_img"),
  controllerFacility.createFacility
);
router.get("/", isAuthenticationToken, controllerFacility.getListFacility);

router.post(
  "/time/:facilityId",
  isAuthenticationToken,
  controllerFacility.getTimePlay
);
router.get(
  "/merchant/detail/:facilityId",
  controllerFacility.getDetailMerchant
);

module.exports = router;
