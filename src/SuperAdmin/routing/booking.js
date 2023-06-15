const express = require("express");
const router = express.Router();
const controllerBooking = require("../controller/booking");

router.get("/", controllerBooking.getBooking);
router.get("/all", controllerBooking.getBookingAll);

module.exports = router;
