const express = require("express");
const router = express.Router();
const controllerMessages = require("../controller/messages");

router.post("/", controllerMessages.addMessage);

module.exports = router;
