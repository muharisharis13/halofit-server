const express = require("express");
const router = express.Router();
const controllerUser = require("../controller/user");
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.get(`/:userId`, isAuthenticationToken, controllerUser.getDetailUser);

module.exports = router;
