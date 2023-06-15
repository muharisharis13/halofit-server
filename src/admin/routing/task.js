const express = require("express");
const router = express.Router();
const controllerTask = require("../controller/task");
const { multer } = require("../../../utils");

router.post(
  "/",
  multer.uploadBannerTask.single("banner_img"),
  controllerTask.createTask
);
router.get("/:merchantId", controllerTask.getListTask);
router.get("/detail/:taskId", controllerTask.detailTask);
router.put(
  "/detail/:merchantId",
  multer.uploadBannerTask.single("banner_img"),
  controllerTask.updateTask
);
router.delete("/", controllerTask.deleteTask);
router.get("/list-task-user/:merchantId", controllerTask.getListTaskUser);
router.get(
  "/list-task-user/detail/:userId/:taskId/:taskUserId",
  controllerTask.getDetailTaskUser2
);
router.put(
  "/list-task-user/detail/:taskUserId",
  controllerTask.updateDetailTaskUser2
);

module.exports = router;
