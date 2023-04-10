const express = require("express");
const router = express.Router();
const controllerTask = require("../controller/task");

router.post("/", controllerTask.createTask);
router.get("/", controllerTask.getListTask);

module.exports = router;
