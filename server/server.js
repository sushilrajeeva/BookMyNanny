import express from "express";
import cors from "cors";
import { generateUploadURL } from "./s3.js";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());

// Added express.json() middleware to parse incoming json requests
app.use(express.json());

app.get("/s3Url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

// stripe checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { transaction } = req.body;
    // this is to keep track of my total amount
    let totalAmount = 0;
    const lineItems = transaction.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.description,
        },
        unit_amount: product.price * 100,
      },
      quantity: 1,
    }));

    //console.log("Transaction", transaction);
    //console.log("My stripe secret key", process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/paymentSuccess`,
      cancel_url: `${process.env.CLIENT_URL}/paymentFailure`,
    });

    return res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
