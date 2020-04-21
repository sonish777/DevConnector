const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

router
  .route("/")
  .post(authController.protectRoute, postController.createPost)
  .get(authController.protectRoute, postController.getAllPosts);

router
  .route("/:id")
  .get(authController.protectRoute, postController.getOnePost)
  .delete(authController.protectRoute, postController.deleteMyPost);

router
  .route("/:id/like")
  .patch(authController.protectRoute, postController.postLike);

router
  .route("/:id/unlike")
  .patch(authController.protectRoute, postController.removeLike);

router
  .route("/:id/comment")
  .patch(authController.protectRoute, postController.postComment);

router
  .route("/:postId/comment/:commentId")
  .delete(authController.protectRoute, postController.deleteComment);

module.exports = router;
