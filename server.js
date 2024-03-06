const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const authentication = require('./routes/authentication');
const mongoose = require('mongoose');

const mongoose_URI = "mongodb://localhost:27017/ecommerce";

mongoose.connect(mongoose_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB using Mongoose successfully');
});



app.use(bodyParser.json());
app.use(cors())
app.use("/authentication",authentication);













app.listen(3000)