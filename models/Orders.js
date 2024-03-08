const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId:{type: 'string',required:true},
    items:[
        {
            productId:{type:Number, required:true},
            quantity:{type:Number, required:true, default:1},
            price:{type:Number},
            image:{type:String},
            title:{type:String}
        }
    ],
    shipping:
        {
            userContact:{
                firstName: { type: String, required:true},
                lastName : { type: String},
                phoneNumber:{type: Number, required:true},
                email: {type:String, required:true},
            },
            shippingInfo:{
                address:{type:String, required:true},
                city:{type:String, required:true},
                house:{type:String, required:true},
                postalCode: {type :String, required:true},
                message : {type:String}
            }
        }
    ,
    deliveryDate:{type:Date, required:true},
    createdAt: { type: Date, default: Date.now },
})

const Orders = mongoose.model('Orders', ordersSchema);



module.exports = Orders;