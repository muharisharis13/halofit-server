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
router.get("/detail/:merchantId", controllerTask.detailTask);
router.put("/detail/:merchantId", controllerTask.updateTask);
router.delete("/", controllerTask.deleteTask);

module.exports = router;
