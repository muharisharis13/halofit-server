const express = require("express");
const router = express.Router();
const controllerTask = require("../controller/task");
const { multer } = require("../../../utils");
const { isAuthenticationTokenMerchant } = require("../../../utils/token");

router.post(
  "/",
  isAuthenticationTokenMerchant,
  multer.uploadBannerTask.single("banner_img"),
  controllerTask.createTask
);
router.get(
  "/:merchantId",
  isAuthenticationTokenMerchant,
  controllerTask.getListTask
);
router.get(
  "/detail/:taskId",
  isAuthenticationTokenMerchant,
  controllerTask.detailTask
);
router.put(
  "/detail/:merchantId",
  isAuthenticationTokenMerchant,
  multer.uploadBannerTask.single("banner_img"),
  controllerTask.updateTask
);
router.delete("/", isAuthenticationTokenMerchant, controllerTask.deleteTask);
router.get(
  "/list-task-user/:merchantId",
  isAuthenticationTokenMerchant,
  controllerTask.getListTaskUser
);
router.get(
  "/list-task-user/detail/:userId/:taskId/:taskUserId",
  isAuthenticationTokenMerchant,
  controllerTask.getDetailTaskUser2
);
router.put(
  "/list-task-user/detail/:taskUserId",
  isAuthenticationTokenMerchant,
  controllerTask.updateDetailTaskUser2
);

module.exports = router;
