const express = require("express");
const router = express.Router();
const controllerMerchant = require("../controller/merchant");

router.get("/", controllerMerchant.getMerchant);

module.exports = router;
