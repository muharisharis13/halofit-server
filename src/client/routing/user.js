const express = require("express");
const router = express.Router();
const controllerUser = require("../controller/user");
const { token } = require("../../../utils");
const { multer } = require("../../../utils");
const { uploadProfilePicture } = multer;
const { isAuthenticationToken } = token;

router.get(`/:userId`, isAuthenticationToken, controllerUser.getDetailUser);

router.put(
  `/:userId`,
  isAuthenticationToken,
  uploadProfilePicture.single("profile_img"),
  controllerUser.updateUser
);

module.exports = router;
