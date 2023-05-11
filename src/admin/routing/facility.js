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

module.exports = router;
