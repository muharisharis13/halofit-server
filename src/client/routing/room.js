const express = require("express");
const router = express.Router();
const controllerRoom = require("../controller/room");
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.delete("/:room_id", isAuthenticationToken, controllerRoom.deleteRoom);
router.put("/:room_id", isAuthenticationToken, controllerRoom.editRoom);
router.get("/:room_id", isAuthenticationToken, controllerRoom.getDetailRoom);
router.get("/", isAuthenticationToken, controllerRoom.getListRoom);
router.post("/", isAuthenticationToken, controllerRoom.createRoom);
router.post("/join", isAuthenticationToken, controllerRoom.joinRoom);
router.post("/cancel", isAuthenticationToken, controllerRoom.cancelJoin)
router.get(
  "/request/:user_id",
  isAuthenticationToken,
  controllerRoom.getListReqJoinRoom
);
router.put(
  "/request/approved",
  isAuthenticationToken,
  controllerRoom.approvedRequestUser
);
router.get("/own/:user_id", isAuthenticationToken, controllerRoom.getOwnRoom);
router.post("/start", isAuthenticationToken, controllerRoom.StartRoom)

module.exports = router;
