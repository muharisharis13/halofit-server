const express = require("express");
const router = express.Router();
const { isAuthenticationToken } = require("../../../utils/token");
const controllerPromo = require("../controller/promo");

router.get("/", isAuthenticationToken, controllerPromo.getPromo);
router.get(
  "/ownPromo/:userId",
  isAuthenticationToken,
  controllerPromo.getOwnPromo
);
router.post("/", isAuthenticationToken, controllerPromo.usePromo);

module.exports = router;
