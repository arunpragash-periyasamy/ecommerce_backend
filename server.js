const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const authentication = require('./routes/authentication');
const mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(cors({origin:"*"}))
app.use("/authentication",authentication);
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