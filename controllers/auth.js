const User = require("../models/user");
const Post = require("../models/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userAuth = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPW = await bcrypt.hash(password, 12);
    const newUser = {
      name: name,
      email: email,
      password: hashedPW,
    };

    const user = await User.create(newUser);
    const userData = {};
    userData.name = user.name;
    userData.email = user.email;
    userData.id = user._id;

    res
      .status(201)
      .json({ message: "User created successfully.", user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that email not found!" });
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(400).json({ message: "Password did not match!" });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      "secrettoken",
      { expiresIn: "1h" }
    );

    const userData = {};
    userData.name = user.name;
    userData.email = user.email;
    userData.id = user._id;

    res.status(200).json({ token: token, user: userData });
  } catch (error) {
    res.status(500).json({ message: "Request failed", error: error.message });
  }
};

exports.userUpdate = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.send(404).json({ message: "User not found" });
    }
    user.email = email || user.email;
    user.name = name || user.name;
    if (password) {
      const hashedPW = await bcrypt.hash(password, 12);
      user.password = hashedPW;
    }
    const updatedUser = await user.save();
    const userData = {};
    userData.name = updatedUser.name;
    userData.email = updatedUser.email;
    res
      .status(200)
      .json({ message: "User updated successfully", user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userDelete = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    await Post.deleteMany({ creator: req.userId });
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
