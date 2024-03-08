const mongoose = require('mongoose');

const cardDetailsSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    cardNumber: {type: String, required: true},
    cardHolderName: {type: String, required: true},
    expiration: {type: String, required: true},
    cvv: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
});

const CardDetails = mongoose.model('CardDetails', cardDetailsSchema);
module.exports = CardDetails;
