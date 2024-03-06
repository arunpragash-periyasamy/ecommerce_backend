const Cart = require("../models/Cart");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send({ message: "Received" });
});

router.post("/item", async (req, res) => {
  const { productId, userId, quantity } = req.body;
  try {
    let userCart = await Cart.findOne({ userId: userId });
    if (!userCart) {
      userCart = new Cart({ userId: userId, items: [] });
    }
    const existingItem = userCart.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      userCart.items.push({ productId: productId, quantity: quantity });
    }
    const id = await userCart.save();
    res.status(201).send({ message: "Product added to the cart" });
  } catch (err) {
    res.status(400).send({ messsage: err });
  }
});

router.delete('/item', async(req, res)=>{
    const {userId, productId} = req.body;
    try{
    const cart = await Cart.findOne({userId:userId});
    if(cart.length===0 || cart?.items?.length===0){
        res.status(200).send({message: "Empty Cart"});
        return;
    }
    let index = cart?.items?.findIndex(item=> (item.productId===productId))
    if(index !==-1){
        cart.items.splice(index,1);
        cart.save();
        res.send("product deleted");
        return;
    }
    res.status(200).send({message:"product not found"});
}catch(err){
    console.log("error ",err);
    res.status(400).send({"message":err});
}
})

module.exports = router;
