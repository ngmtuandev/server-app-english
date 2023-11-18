const userController = require("../controllers/userAuth");
const express = require("express");
const verifyToken = require("../middeware/verifyToken");
const verifyAdmin = require("../middeware/verifyAdmin");
const uploadCloud = require("../config/cloudinary.config");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/current", verifyToken, userController.getUser);
router.get("/completed/:token", userController.completedRegister);
router.post("/refreshAccessToken", userController.refreshAccessTokenUser);
router.get("/users", [verifyToken, verifyAdmin], userController.getAllUsers);
router.delete("/:id", [verifyToken, verifyAdmin], userController.deleteUser);
router.put(
  "/update",
  [verifyToken],
  uploadCloud.single("image"),
  userController.updateUser
);

module.exports = router;
