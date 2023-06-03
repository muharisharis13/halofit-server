const express = require("express");
const router = express.Router();
const controllerMerchant = require("../controller/merchant");

router.get("/", controllerMerchant.getMerchant);
router.put("/:merchantId", controllerMerchant.blockMerchant);

module.exports = router;
