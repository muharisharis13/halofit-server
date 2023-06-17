const express = require("express");
const router = express.Router();
const controllerUser = require("../controller/user");

router.get("/", controllerUser.getuser);
router.put("/:userId", controllerUser.blockUser);

module.exports = router;
