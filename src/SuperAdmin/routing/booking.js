const express = require("express");
const router = express.Router();
const controllerBooking = require("../controller/booking");

router.get("/", controllerBooking.getBooking);

module.exports = router;
