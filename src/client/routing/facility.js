const express = require("express");
const router = express.Router();
const controllerFacility = require("../controller/facility");
const { multer } = require("../../../utils");
const { uploadBannner } = multer;

router.post(
  "/",
  uploadBannner.single("banner_img"),
  controllerFacility.createFacility
);
router.get("/", controllerFacility.getListFacility);

module.exports = router;
