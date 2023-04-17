const express = require("express");
const router = express.Router();
const controllerTask = require("../controller/task");
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.get("/", isAuthenticationToken, controllerTask.getListTask);
router.get("/:taskId", isAuthenticationToken, controllerTask.getTaskDetail);
router.get(
  "/progress/:userId",
  isAuthenticationToken,
  controllerTask.getListTaskOnProgress
);

module.exports = router;
