const express = require("express");
const { uploadImages, deleteImages } = require("../controllers/upload");
const { isAdmin, isAuth } = require("../middleware/is-auth");
const { uploadPhoto, imgResize } = require("../middleware/uploadImage");
const router = express.Router();

router.post(
  "/",
  isAuth,
  isAdmin,
  uploadPhoto.array("images", 10),
  imgResize,
  uploadImages
);

router.delete("/delete-img/:id", isAuth, isAdmin, deleteImages);

module.exports = router;
