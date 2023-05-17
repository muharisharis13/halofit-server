const express = require("express");
const router = express.Router();
const controllerTask = require("../controller/task");

router.get("/", controllerTask.getTask);

module.exports = router;
