const userController = require("../controllers/blog");
const express = require("express");
const verifyToken = require("../middeware/verifyToken");
const verifyAdmin = require("../middeware/verifyAdmin");
const router = express.Router();
const uploadCloud = require("../config/cloudinary.config");

router.post(
  "/new-post",
  verifyToken,
  uploadCloud.single("image"),
  userController.createPost
);
router.post(
  "/up-img/:id",
  verifyToken,
  uploadCloud.single("image"),
  userController.uploadImg
);
router.get("/all-post", userController.getAllPost);
router.get("/:idPost", userController.getOnePost);
router.delete("/:idPost", verifyToken, userController.deletePost);
router.put("/like/:idPost", verifyToken, userController.likePost);

module.exports = router;
