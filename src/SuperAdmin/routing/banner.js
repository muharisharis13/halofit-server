const express = require("express");
const router = express.Router();
const controllerBanner = require("../controller/banner");
const { uploadBannerSuperAdmin } = require("../../../utils/multer");

router.post(
  "/",
  uploadBannerSuperAdmin.single("banner_img"),
  controllerBanner.addBanner
);
router.get("/", controllerBanner.getBanner);

module.exports = router;
