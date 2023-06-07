const express = require("express");
const router = express.Router();
const controllerBooking = require("../controller/booking");
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.get(
  "/:booking_id",
  isAuthenticationToken,
  controllerBooking.getDetailBooking
);
router.delete(
  "/:booking_id",
  isAuthenticationToken,
  controllerBooking.deleteBooking
);
router.put(
  "/:booking_id",
  isAuthenticationToken,
  controllerBooking.editBooking
);
router.get(
  "/own/:userId",
  isAuthenticationToken,
  controllerBooking.getOwnBooking
);
router.get("/", isAuthenticationToken, controllerBooking.getListBooking);
router.post("/", isAuthenticationToken, controllerBooking.createBooking);
router.post("/cancel", isAuthenticationToken, controllerBooking.cancelBooking);

module.exports = router;
