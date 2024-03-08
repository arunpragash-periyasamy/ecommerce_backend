require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authentication = require('./routes/authentication');
const cart = require('./routes/cart');
const orders = require('./routes/orders');
const cardDetails = require('./routes/cardDetails');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
// Function to verify JWT token using async/await
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(" ")[1];
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    req.body.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send({"message":"Unauthorized credentials"});
  }
};


app.use(bodyParser.json());
app.use(cors({origin:"*"}))

try{
app.use("/cart",verifyToken,cart);
app.use("/order", verifyToken,orders);
app.use("/authentication",authentication);
app.use("/cardDetails", verifyToken,cardDetails);
}catch(err){
  console.log("Error in the routing ",err);
}

try{

  const mongoose_URI = process.env.MONGO_URI;
  mongoose.connect(mongoose_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', function() {
      console.log('Connected to MongoDB using Mongoose successfully');
  });
}catch(err){
  console.log("Mongo db connection error : ", err);
}

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port " + process.env.PORT);
})