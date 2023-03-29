const express = require("express");
const router = express.Router();
const controllelFeature = require("../controller/feature");

router.delete("/:feature_id", controllelFeature.deleteFeature);
router.put("/:feature_id", controllelFeature.editFeature);
router.get("/:feature_id", controllelFeature.getDetailFeature);
router.get("/", controllelFeature.getLiteFeature);
router.post("/", controllelFeature.createFeature);

module.exports = router;
