const express = require("express");
const router = express.Router();
const { isAuthenticationToken } = require("../../../utils/token");
const controllerNotification = require("../controller/notification");

router.get("/:userId", isAuthenticationToken, controllerNotification.getNotif);
router.post(
  "/approve",
  isAuthenticationToken,
  controllerNotification.approveRequestJoinRoom
);
router.post(
  "/reject",
  isAuthenticationToken,
  controllerNotification.rejectRequstJoinRoom
);

module.exports = router;
