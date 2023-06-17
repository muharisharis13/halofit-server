const express = require("express");
const router = express.Router();
const controllerEmail = require("../controller/sendEmail");

router.post("/", controllerEmail.sendEmail);
router.put("/:id", controllerEmail.updateStatusMessages);

module.exports = router;
