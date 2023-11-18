const userRouter = require("./user");
const vocabularyRouter = require("./vocabulary");
const postRouter = require("./post");
const commentRouter = require("./comment");

const initRoute = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/vocabulary", vocabularyRouter);
  app.use("/api/post", postRouter);
  app.use("/api/comment", commentRouter);
};

module.exports = initRoute;
