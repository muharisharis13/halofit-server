const express = require("express");
const router = express.Router();
const controllerPromo = require("../controller/promo");

router.get("/", controllerPromo.getPromo);

module.exports = router;
