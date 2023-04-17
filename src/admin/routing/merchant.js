const express = require("express");
const router = express.Router();
const controllerMerchant = require("../controller/merchant");

router.post("/feature", controllerMerchant.addFeature);
router.get("/time/:merchant_id", controllerMerchant.getListTimeOpenAndClose);
router.post("/time/:merchant_id", controllerMerchant.addTimeOpenAndClose);
router.get("/", controllerMerchant.getListMerchant);

module.exports = router;
