require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authentication = require('./routes/authentication');
const cart = require('./routes/cart');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
// Function to verify JWT token using async/await
const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'].split(" ")[1];
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    req.body.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send({"message":err});
  }
};

const secretKey = "GUVI_ECOMMERCE"

app.use(bodyParser.json());
app.use(cors({origin:"*"}))
app.use("/authentication",authentication);
app.use("/cart",verifyToken,cart);


const mongoose_URI = process.env.MONGO_URI;

mongoose.connect(mongoose_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB using Mongoose successfully');
});

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port " + process.env.PORT);
})