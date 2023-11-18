const Post = require("../model/post.js");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const PostController = {
  createPost: asyncHandler(async (req, res) => {
    const { id } = req.auth;
    // console.log("token user body text>>>>", req.body);
    // return;
    // console.log("token user file>>>>", req.file);
    if (!req.body.text) {
      res.status(401).json({
        status: 1,
        mess: "Bài đăng không được bỏ trống",
      });
    } else {
      const tempImages = [];
      if (req.file) {
        tempImages.push(req.file.path);
      }
      const newPost = await Post.create({
        user: id,
        img: tempImages,
        ...req.body,
      });
      // console.log("newPost >>>>", newPost);
      if (newPost) {
        res.status(201).json({
          status: 0,
          mess: "Tạo bài viết mới thành công",
          data: newPost,
        });
      } else {
        res.status(401).json({
          status: 1,
          mess: "Tạo bài viết thất bại",
        });
      }
    }
  }),
  getAllPost: asyncHandler(async (req, res) => {
    const allPost = await Post.find().populate("user");
    console.log(allPost);
    if (allPost) {
      res.status(200).json({
        status: 0,
        mess: "Lấy tất cả bài biết thành công",
        data: allPost,
      });
    }
  }),
  getOnePost: asyncHandler(async (req, res) => {
    const { idPost } = req.params;
    if (idPost) {
      const post = await Post.findById(idPost).populate("user");
      if (post) {
        res.status(200).json({
          status: 0,
          mess: "lấy một bài viết thành công",
          data: post,
        });
      } else {
        res.status(401).json({
          status: -1,
          mess: "lấy một bài viết thất bại",
        });
      }
    }
  }),
  likePost: asyncHandler(async (req, res) => {
    const { id } = req.auth;
    const { idPost } = req.params;
    const findPostLike = await Post.findById(idPost);
    if (!findPostLike) {
      res.status(400).json({
        status: 1,
        mess: "Không tìm thấy bài viết bạn muốn thích",
      });
    } else {
      if (findPostLike.likes.includes(id)) {
        findPostLike.likes = findPostLike.likes.filter(
          (idUser) => idUser !== id
        );
        await findPostLike.save();
        res.status(200).json({ status: "Bạn đã bỏ thích bài viết này" });
      } else {
        findPostLike.likes.push(id);
        await findPostLike.save();
        res.status(200).json({ status: "Bạn đã thích bài viết này" });
      }
    }
  }),
  deletePost: asyncHandler(async (req, res) => {
    const { idPost } = req.params;
    const deleteP = await Post.findByIdAndRemove(idPost);
    if (deleteP) {
      res.status(201).json({
        status: 0,
        mess: "Xóa bài đăng thành công",
      });
    }
  }),

  uploadImg: asyncHandler(async (req, res) => {
    // console.log();
    const { id } = req.params;
    const postAddImg = await Post.findById(id);
    console.log("req.file >>>", req.file);
    if (req.file) {
      postAddImg.img.push(req.file.path);
      await postAddImg.save();
    }
    return res.status(200).json({
      status: 0,
    });
  }),
};

module.exports = PostController;
