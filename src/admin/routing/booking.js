const express = require("express");
const router = express.Router();
const controllerBooking = require("../controller/booking");
const { isAuthenticationTokenMerchant } = require("../../../utils/token");

router.post(
  "/",
  isAuthenticationTokenMerchant,
  controllerBooking.createBooking
);
router.get(
  "/:merchantId",
  isAuthenticationTokenMerchant,
  controllerBooking.bookingList
);

module.exports = router;
