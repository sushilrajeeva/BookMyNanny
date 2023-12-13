import express from "express";
import cors from "cors";
import { generateUploadURL } from "./s3.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import db from "./firebase-config.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  runTransaction,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

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
const getAllListings = async () => {
  try {
    const listingsCollection = collection(db, "Listings");

    const listingsSnapshot = await getDocs(listingsCollection);

    const allListings = [];

    listingsSnapshot.forEach((doc) => {
      const listData = doc.data();
      allListings.push(listData);
    });

    return allListings;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Error getting all users");
  }
};
app.get("/listings", async (req, res) => {
  try {
    let data = await getAllListings();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
