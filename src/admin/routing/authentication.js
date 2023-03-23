const express = require("express");
const router = express.Router();
const controllerAuthentication = require("../controller/authentication");

router.post("/register", controllerAuthentication.register);
router.post("/login", controllerAuthentication.login);

module.exports = router;
