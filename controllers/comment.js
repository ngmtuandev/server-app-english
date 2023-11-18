const Comment = require("../model/comment.js");
const asyncHandler = require("express-async-handler");

const CommentController = {
  createComment: asyncHandler(async (req, res) => {
    const { id } = req.auth;
    const { pid } = req.params;
    if (req.body.text) {
      console.log(req.body.text);
      const newComment = await Comment.create({
        text: req.body.text,
        user: id,
        post: pid,
      });
      if (newComment) {
        res.status(201).json({
          status: 0,
          mess: "Bình luận bài viết thành công",
        });
      }
    }
  }),
  getAllCommenItemPost: asyncHandler(async (req, res) => {
    // const {pid} = req.params
    // console.log(pid)
    const commentItemPost = await Comment.find().populate("user");
    console.log("commentItemPost", commentItemPost);
    if (commentItemPost) {
      return res.status(200).json({
        status: 0,
        data: commentItemPost,
      });
    }
  }),
};

module.exports = CommentController;
