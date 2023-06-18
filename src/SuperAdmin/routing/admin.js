const express = require("express");
const router = express.Router();
const controllerAdmin = require("../controller/Admin");

router.get("/:adminId", controllerAdmin.getSuperAdmin);

module.exports = router;
