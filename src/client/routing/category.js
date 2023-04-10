const express = require("express")
const router = express.Router();
const controllerCategory = require("../controller/category");
const { token } = require("../../../utils");
const { isAuthenticationToken } = require("../../../utils/token");


router.get("/", isAuthenticationToken, controllerCategory.getAllCategory)

module.exports = router;