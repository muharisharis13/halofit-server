const express = require("express");
const router = express.Router();
const controllerTask = require("../controller/task");
const { multer } = require("../../../utils");

router.post(
  "/",
  multer.uploadBannnerTask.single("banner_img"),
  controllerTask.createTask
);
router.get("/:merchantId", controllerTask.getListTask);
router.get("/detail/:taskId", controllerTask.detailTask);
router.put(
  "/detail/:merchantId",
  multer.uploadBannnerTask.single("banner_img"),
  controllerTask.updateTask
);
router.delete("/", controllerTask.deleteTask);
router.get("/list-task-user/:merchantId", controllerTask.getListTaskUser);
router.get("/list-task-user/detail/:userId", controllerTask.getDetailTaskUser);
router.put(
  "/list-task-user/detail/:userId",
  controllerTask.updateDetailTaskUser
);

module.exports = router;
