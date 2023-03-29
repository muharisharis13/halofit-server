const express = require("express");
const router = express.Router();
const controllerCategory = require("../controller/category");

router.post("/:category_id", controllerCategory.addCategory);
router.delete("/:category_id", controllerCategory.deleteCategory);
router.put("/:category_id", controllerCategory.editCategory);
router.get("/:category_id", controllerCategory.getDetailCat);
router.get("/", controllerCategory.getListCat);

module.exports = router;
