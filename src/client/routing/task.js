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
router.get(
  "/progress2/:userId",
  isAuthenticationToken,
  controllerTask.getListTaskOnProgress2
);
router.get(
  "/progress/detail/:userId/:taskId",
  isAuthenticationToken,
  controllerTask.getDetailTaskProgress
);

module.exports = router;
