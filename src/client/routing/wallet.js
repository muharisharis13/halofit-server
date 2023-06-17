const express = require("express");
const router = express.Router();
const controllerWallet = require("../controller/wallet");
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.put("/topup/:userId", isAuthenticationToken, controllerWallet.topUp);
router.put(
  "/withdraw/:userId",
  isAuthenticationToken,
  controllerWallet.withdraw
);

module.exports = router;
