const express = require("express");
const router = express.Router();
const controllelFeature = require("../controller/feature");
const { token } = require("../../../utils");

const { isAuthenticationToken } = token;

router.delete(
  "/:feature_id",
  isAuthenticationToken,
  controllelFeature.deleteFeature
);
router.put(
  "/:feature_id",
  isAuthenticationToken,
  controllelFeature.editFeature
);
router.get(
  "/:feature_id",
  isAuthenticationToken,
  controllelFeature.getDetailFeature
);
router.get("/", isAuthenticationToken, controllelFeature.getLiteFeature);
router.post("/", isAuthenticationToken, controllelFeature.createFeature);

module.exports = router;
