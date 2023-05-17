const express = require("express");
const router = express.Router();
const controllerRoom = require("../controller/Meetup");

router.get("/", controllerRoom.getRoom);

module.exports = router;
