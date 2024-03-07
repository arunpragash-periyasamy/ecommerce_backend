require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Cart = require("../models/Cart");

router.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({ message: "User signed up successfully", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.find({ email: email });
  if (user.length === 0) {
    return res.status(400).json({ message: "User not found" });
  }
  const validPassword = await bcrypt.compare(password, user[0].password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const data = await Cart.aggregate([
    {
      $match: {
        userId: user[0]._id,
      },
    },
    {
      $project: {
        _id: 0,
        userId: 0,
        "items._id": 0, 
      },
    },
  ]);
  let token = jwt.sign(
    { userName: user[0].userName, userId: user[0]._id },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({ user: { token: token, userName: user[0]?.userName }, cart: data[0]?.items });
});

module.exports = router;
