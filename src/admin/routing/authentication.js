const express = require("express");
const router = express.Router();
const controllerAuthentication = require("../controller/authentication");

router.post("/register", controllerAuthentication.register);
router.post("/login", controllerAuthentication.login);
router.post(
  "/find-account-by-pin",
  controllerAuthentication.verifyAccountByPin
);
router.post("/update-password", controllerAuthentication.setupNewPassword);

module.exports = router;
