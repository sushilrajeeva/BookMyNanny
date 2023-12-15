import express from "express";
import cors from "cors";
import { generateUploadURL } from "./s3.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import db from "./firebase-config.js";
import { client } from "./config/redisConfig.js";
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
app.use(express.json());

app.get("/s3Url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { transaction } = req.body;
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

async function getNannyById(id) {
  try {
    const nannyDocRef = doc(db, "Nanny", id);
    const docSnapshot = await getDoc(nannyDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data;
    } else {
      throw new Error("No nanny exists");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error getting user document");
  }
}

const updateNannyData = async (id, obj) => {
  const nannyDocRef = doc(db, "Nanny", id);
  try {
    await runTransaction(db, async (transaction) => {
      const nannyDoc = await transaction.get(nannyDocRef);
      if (!nannyDoc.exists()) {
        throw new Error("Document does not exist!");
      }
      transaction.update(nannyDocRef, obj);
    });
  } catch (e) {
    console.log(e);
    throw new Error("Error updating nanny data");
  }
};

app.get("/getNanny/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authCach = await client.exists(`nanny-${id}`);
    if (authCach) {
      console.log("From cache");
      const data = await client.json.get(`nanny-${id}`);
      return res.status(200).json(data);
    } else {
      console.log("Not from cache");
      let data = await getNannyById(id);
      if (data.length !== 0) {
        await client.json.set(`nanny-${id}`, "$", data);
      }
      return res.status(200).json(data);
    }
  } catch (error) {
    throw error;
  }
});

app.patch("/updateNanny/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    await updateNannyData(id, updatedData);
    const nannyData = await getNannyById(id);
    await client.json.set(`nanny-${id}`, "$", nannyData);
    res.status(200).json({ success: true });
  } catch (error) {
    throw error;
  }
});

async function getParentById(id) {
  try {
    const parentDocRef = doc(db, "Parent", id);
    const docSnapshot = await getDoc(parentDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data;
    } else {
      throw new Error("No parent exists");
    }
  } catch (error) {
    throw new Error("Error getting user document");
  }
}

const updateParentData = async (id, obj) => {
  const parentDocRef = doc(db, "Parent", id);

  try {
    await runTransaction(db, async (transaction) => {
      const parentDoc = await transaction.get(parentDocRef);
      console.log("ParentDoc", parentDoc);
      if (!parentDoc.exists()) {
        throw new Error("Document does not exist!");
      }
      transaction.update(parentDocRef, obj);
    });
  } catch (e) {
    throw new Error("Error updating parent data");
  }
};

app.get("/getParent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authCach = await client.exists(`parent-${id}`);
    if (authCach) {
      console.log("From cache");
      const data = await client.json.get(`parent-${id}`);
      return res.status(200).json(data);
    } else {
      console.log("Not from cache");
      let data = await getParentById(id);
      if (data.length !== 0) {
        await client.json.set(`parent-${id}`, "$", data);
      }
      return res.status(200).json(data);
    }
  } catch (error) {
    throw error;
  }
});

app.patch("/updateParent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    console.log("DATA", updatedData);
    await updateParentData(id, updatedData);
    const parentData = await getParentById(id);
    await client.json.set(`parent-${id}`, "$", parentData);
    res.status(200).json({ success: true });
  } catch (error) {
    throw error;
  }
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
