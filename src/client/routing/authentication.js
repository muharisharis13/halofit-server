const express = require("express");
const router = express.Router();
const controllerAuthentication = require("../controller/authentication");

router.get("/", controllerAuthentication.getlistUser);
router.post("/login", controllerAuthentication.login);
router.post("/register", controllerAuthentication.register);
router.post(
  "/find-account-by-pin",
  controllerAuthentication.verifyAccountByPin
);
router.post("/update-password", controllerAuthentication.setupNewPassword);
router.get("/data", (req, res) => {
  res.json("hallo");
});

module.exports = router;
