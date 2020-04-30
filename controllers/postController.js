const AppError = require("../utils/AppError");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports.createPost = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError(404, "user not found"));
    }

    req.body.user = user.id;
    req.body.name = user.name;
    req.body.avatar = user.avatar;

    const post = await Post.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, error.message));
  }
};

module.exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.getOnePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return next(
        new AppError(404, "The post for given user ID was not found")
      );
    }
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.deleteMyPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    // Check user
    if (post.user.toString() != req.user.id) {
      return next(new AppError(401, "User not authorized"));
    }

    await post.remove();
    res.status(204).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return next(
        new AppError(404, "The post for given user ID was not found")
      );
    }
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.postLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    if (
      post.like.filter((el) => el.user._id.toString() === req.user.id).length >
      0
    ) {
      return next(new AppError(400, "Post alredy liked"));
    }

    post.like.unshift({ user: req.user.id });

    const newPost = await post.save();

    res.status(200).json({
      status: "success",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return next(new AppError(404, "The post was not found"));
    }
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.removeLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    if (
      post.like.filter((el) => el.user._id.toString() === req.user.id)
        .length === 0
    ) {
      // console.log();
      return next(new AppError(400, "Post has not yet been liked"));
    }

    const removeIndex = post.like
      .map((like) => like.user._id.toString())
      .indexOf(req.user.id);

    if (removeIndex < 0) {
      return next(new AppError(400, "Post has not yet been liked"));
    }

    post.like.splice(removeIndex, 1);

    const newPost = await post.save();

    res.status(200).json({
      status: "success",
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return next(new AppError(404, "The post was not found"));
    }
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.postComment = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError(404, "user not found"));
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    req.body.user = user.id;
    req.body.name = user.name;
    req.body.avatar = user.avatar;

    post.comments.unshift(req.body);

    const updatedPost = await post.save();

    res.status(200).json({
      status: "success",
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return next(new AppError(404, "The post was not found"));
    }
    return next(new AppError(500, "Something went wrong"));
  }
};

module.exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    // Make sure comment exists
    if (!comment) {
      return next(new AppError(404, "Comment was not found"));
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return next(new AppError(401, "User not authorized"));
    }

    // Get index of comment to remove
    // const removeIndex = post.comments
    //   .map((comment) => comment.user.toString())
    //   .indexOf(req.user.id);

    const removeIndex = post.comments.findIndex((el) => el.id === comment.id);

    if (removeIndex < 0) {
      return next(new AppError(404, "Comment not found"));
    }

    post.comments.splice(removeIndex, 1);

    const updatedPost = await post.save();
    res.status(200).json({
      status: "success",
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.name === "CastError") {
      return next(new AppError(404, "The post was not found"));
    }
    return next(new AppError(500, "Something went wrong"));
  }
};
