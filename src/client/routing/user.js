const express = require("express");
const router = express.Router();
const controllerUser = require("../controller/user");

router.get(`/:user_id`, controllerUser.getDetailUser);

module.exports = router;
