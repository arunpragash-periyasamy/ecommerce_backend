const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User')


router.post("/signup",async(req,res)=>{
    const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.json({ message: 'User signed up successfully', userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.find({email:email});
    if (user.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    
    let token=jwt.sign({userId : user._id}, "GUVI_ECOMMERCE", {expiresIn: '1h'});
    res.json({token:token, userName: user[0].userName});
});

module.exports = router;