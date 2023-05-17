const express = require("express");
const router = express.Router();
const controllerUser = require("../controller/user");

router.get("/", controllerUser.getuser);

module.exports = router;
