const router = require("express").Router();
const CardDetails = require("../models/CardDetails");

router.get("/", async (req, res) => {
    const {userId} = req.body;
    const data = await CardDetails.findOne({userId:userId},{_id:0, userId:0, createdAt:0, __v:0});
    res.send({ cardDetails: data });
});

router.post("/", async (req, res) => {
  try {
    let cardDetails = await CardDetails.findOne({ userId: req.body.userId });
    if (!cardDetails) {
      cardDetails = new CardDetails(req.body);
    } else {
      cardDetails.cardNumber = req.body.cardNumber;
      cardDetails.cardHolderName = req.body.cardHolderName;
      cardDetails.cardExpiry = req.body.cardExpiry;
      cardDetails.cardCvv = req.body.cardCvv;
    }
    await cardDetails.save();
    res.send({ message: "Card Details updated" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

module.exports = router;
