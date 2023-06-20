const express = require("express");
const router = express.Router();
const controllerHistory = require("../controller/history");

const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.get("/:userId", isAuthenticationToken, controllerHistory.getHistory);

module.exports = router;
