const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userAuth = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPW = await bcrypt.hash(password, 12);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPW,
    });

    const user = await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully.", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await userModel.findOne({ email: email });

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

    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (error) {
    res.status(500).json({ message: "Request failed", error: error.message });
  }
};
