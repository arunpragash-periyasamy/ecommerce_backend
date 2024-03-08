const Cart = require("../models/Cart");
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send({ message: "Received" });
});

router.post("/item", async (req, res) => {
  const {  userId, ...product} = req.body;
  try {
    let userCart = await Cart.findOne({ userId: userId });
    if (!userCart) {
      userCart = new Cart({ userId: userId, items: [] });
    }
    const existingItem = userCart.items.find(
      (item) => item.productId === Number(product.productId)
    );
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      userCart.items.push(product);
    }
    const id = await userCart.save();
    res.status(201).send({ message: "Product added to the cart" });
  } catch (err) {
    console.log("error ",err)
    res.status(400).send({ messsage: err });
  }
});

router.get('/item', async(req, res)=>{
  const {userId} = req.body;
  try{
    const data = await Cart.findOne({ userId: userId});
    if(data){
      res.send(data?.items);
    }else{
      res.send([]);
    }
  }catch(err){
    console.log("error ",err);
    res.status(400).send({"message":err});
  }
});

router.delete('/item', async(req, res)=>{
    const {userId} = req.body;
    const {productId} = req.query;
    try{
    const cart = await Cart.findOne({userId:userId});
    if(cart.length===0 || cart?.items?.length===0){
        res.status(200).send({message: "Empty Cart"});
        return;
    }
    let index = cart?.items?.findIndex(item=> (item.productId===Number(productId)))
    if(index !==-1){
        cart.items.splice(index,1);
        cart.save();
        res.send({message:"product deleted"});
        return;
    }
    res.status(200).send({message:"product not found"});
}catch(err){
    console.log("error ",err);
    res.status(400).send({"message":err});
}
})

module.exports = router;
