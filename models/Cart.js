const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    items:[
        {
            productId:{type:Number, required:true},
            quantity:{type:Number, required:true, default:1}
        }
    ],
    createdAt: { type: Date, default: Date.now },
})

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;