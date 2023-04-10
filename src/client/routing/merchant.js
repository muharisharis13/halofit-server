const express = require("express")
const router = express.Router()
const controllerMerchant = require("../controller/merchant")
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;


router.get("/", isAuthenticationToken, controllerMerchant.getAllMerchant)


module.exports = router