const Post = require("../models/model");
const User = require("../models/user");

exports.feedResponse = (req, res) => {
  console.log("I got data with accurate responses.");
  res.json({ id: 1, name: "kgn", age: 20 });
};

exports.feedPost = (req, res) => {
  const content = req.body.content;
  const title = req.body.title;
  const image = req.file.path;
  let postCreator;
  const newPost = new Post({
    title: title,
    imageURL: image,
    content: content,
    creator: req.userId,
  });
  newPost
    .save()
    .then((post) => {
      return User.findById(post.creator);
    })
    .then((user) => {
      postCreator = user;
      user.posts.push(newPost);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Data saved to the server successfully!",
        data: newPost,
        creator: { _id: postCreator._id, name: postCreator.name },
      });
    })
    .catch((error) => console.log(error));
};

exports.getPost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((response) => res.status(200).json(response))
    .catch((error) => console.log(error));
};

exports.updatePost = (req, res) => {
  const postId = req.params.postId;
  const content = req.body.content;
  const title = req.body.title;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        console.log("No post found!");
        return;
      }
      if (post.creator.toString() !== req.userId) {
        console.log("You can only update your own posts");
        return;
      }
      post.title = title;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Post updated.", data: result });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.deletePost = (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        console.log("No post found!");
        return;
      }
      if (post.creator.toString() !== req.userId) {
        console.log("You can only update your own posts");
        return;
      }
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post deleted successfully." });
    })
    .catch((error) => console.log(error));
};
