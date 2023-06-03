const express = require("express");
const router = express.Router();
const controllerEmail = require("../controller/sendEmail");

router.post("/", controllerEmail.sendEmail);

module.exports = router;
