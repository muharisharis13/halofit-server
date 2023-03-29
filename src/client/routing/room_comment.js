const express = require("express");
const router = express.Router();
const controllerRoomComment = require("../controller/room_comment");

router.get("/room_id", controllerRoomComment.getListRoomCommentByRoomId);
router.post("/", controllerRoomComment.createRoomComment);

module.exports = router;
