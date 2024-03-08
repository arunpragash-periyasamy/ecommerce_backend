const router = require("express").Router();
const Orders = require("../models/Orders");
const Cart = require("../models/Cart");

const generateOrderId = async(orderId)=>{
    const currentDate = new Date();
  const currentDateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

  if (orderId) {
    const regex = /^ORD(\d{8})(\d{4})$/;
    const match = orderId.match(regex);
    if (match && match[1] === currentDateString) {
      // Increment the existing number and return the updated orderId
      const newNumber = String(Number(match[2]) + 1).padStart(4, '0');
      return `ORD${currentDateString}${newNumber}`;
    }
  }

  // Create a new orderId with the current date and starting number 0001
  const newOrderId = `ORD${currentDateString}0001`;
  return newOrderId;
}


const generateRandomDeliveryDate = async(orderId) =>{
    // Extract the date from the OrderId
    try{
            // Extract the date from the OrderId
            const year = orderId.slice(3,7);
            const month = orderId.slice(7,9);
            const date = orderId.slice(9,11);
            const orderDate = new Date(year,month,date);
            const randomOffset = Math.floor(Math.random() * (9 - 3 + 1)) + 3;
            const deliveryDate = new Date(orderDate);
            deliveryDate.setDate(orderDate.getDate() + randomOffset);
            return deliveryDate;
    }catch(err){
        console.log(err);
    }
    return "error";
  }

router.get("/", async (req, res) => {
  const { userId } = req.body;
  try {
    const data = await Orders.find({ userId: userId },{_id:0, userId:0, __v:0});
    res.send({ orders: data });
  } catch (err) {
    console.log("error ", err);
    res.status(400).send({ message: err });
  }
});

router.post("/", async (req, res) => {
    try{

        const items = await Cart.findOne({ userId: req.body.userId });
        if(!items){
            res.send({message: "Cart is Empty"}).status(404);
            return;
        }
        const previousOrderId = await Orders.findOne({},{orderId:1,_id:1}).sort({createdAt:-1});
        const orderId = await generateOrderId(previousOrderId?.orderId);
        const{userId, ...shipping} = req.body;
        const deliveryDate = await generateRandomDeliveryDate(orderId);
        const order = new Orders({ userId, shipping, items:items?.items, orderId, deliveryDate });
        await Cart.deleteOne({userId:userId});
        await order.save();
        res.status(201).send({ message: "Order Placed" });
    }catch(err){
        console.log("error ",err);
        res.status(400).send({ message: err });
    }
});

router.get("/shipping",async (req, res)=>{
    const{userId} = req.body;
    try{
        const data = await Orders.findOne({userId},{_id:0,userId:0, orderId:0,items:0, createdAt:0, deliveryDate:0}).sort({createdAt:-1});
        res.send(data);
    }catch(err){
        console.log("error ",err);
        res.status(400).send({ message: err });
    }
})
module.exports = router;
