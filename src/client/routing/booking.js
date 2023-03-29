const express = require("express");
const router = express.Router();
const controllerBooking = require("../controller/booking");

router.get("/:booking_id", controllerBooking.getDetailBooking);
router.delete("/:booking_id", controllerBooking.deleteBooking);
router.put("/:booking_id", controllerBooking.editBooking);
router.get("/", controllerBooking.getListBooking);
router.post("/", controllerBooking.createBooking);

module.exports = router;
