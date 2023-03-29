const express = require("express");
const router = express.Router();
const controllerRoom = require("../controller/room");

router.delete("/:room_id", controllerRoom.deleteRoom);
router.put("/:room_id", controllerRoom.editRoom);
router.get("/:room_id", controllerRoom.getDetailRoom);
router.get("/", controllerRoom.getListRoom);
router.post("/", controllerRoom.createRoom);

module.exports = router;
