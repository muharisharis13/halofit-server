const express = require("express");
const router = express.Router();
const controllerMessages = require("../controller/messages");

router.get("/", controllerMessages.getMessage);

module.exports = router;
