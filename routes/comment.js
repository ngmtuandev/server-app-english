const commentController = require("../controllers/comment");
const express = require("express");
const verifyToken = require("../middeware/verifyToken");
const verifyAdmin = require("../middeware/verifyAdmin");
const router = express.Router();

router.post("/new-comment/:pid", verifyToken, commentController.createComment);
router.get("/allComment/", commentController.getAllCommenItemPost);

module.exports = router;
