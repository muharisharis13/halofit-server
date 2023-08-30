const express = require("express");
const router = express.Router();
const controllerEmail = require("../controller/sendEmail");

router.post("/", controllerEmail.sendEmail);
router.post("/user", controllerEmail.sendEMailUser);
router.post("/merchant", controllerEmail.sendEmailMerchant);
router.put("/:id", controllerEmail.updateStatusMessages);

module.exports = router;
