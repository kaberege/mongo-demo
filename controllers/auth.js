const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userAuth = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPW => {
            const newUser = new userModel({
                name: name,
                email: email,
                password: hashedPW
            });
            console.log(newUser);
            return newUser.save();
        })
        .then(user => {
            console.log("My result.")
            res.status(201).json({ message: "User created successfully.", userId: user._id })
        })
        .catch(error => console.log(error));
}

exports.userLogin = (req, res) => {
    console.log("called");
    const email = req.body.email;
    const password = req.body.password;
    let loaded;
    userModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log("User with that email not found!")
            }
            loaded = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                console.log("Password did not match!")
            }
            const token = jwt.sign({ email: loaded.email, userId: loaded._id.toString() }, "secrettoken", { expiresIn: "1h" });
            res.status(200).json({ token: token, userId: loaded._id.toString() })
        })
        .catch(error => console.log("Request failed.", error));
}