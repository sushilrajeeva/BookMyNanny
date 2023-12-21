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
import { createClient } from "redis";
// Implemented the redis using professor's lecture code
import redis from "redis";
// const redisClient = redis.createClient({
//   host: "redis-10257.c326.us-east-1-3.ec2.cloud.redislabs.com",
//   port: 10257,
// });
const redisClient = createClient({
  password: "mhpfMcaGuB6a4aCczTfsGXcuzWyNkns2",
  socket: {
    host: "redis-10257.c326.us-east-1-3.ec2.cloud.redislabs.com",
    port: 10257,
  },
});
console.log("Connecting to Redis...");
try {
  await redisClient.connect().then(() => {});
  console.log("Connected to Redis successfully");
} catch (error) {
  console.error("Error connecting to Redis:", error);
}

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
    // Creating cache key
    const cacheKey = `nanny:${id}`;
    const cachedNanny = await redisClient.get(cacheKey);

    // checking if the nanny is already cached or not
    // if it is cached i will return it from my redis cache
    if (cachedNanny) {
      console.log("Serving from Cache");
      return JSON.parse(cachedNanny);
    }

    const nannyDocRef = doc(db, "Nanny", id);
    const docSnapshot = await getDoc(nannyDocRef);

    // If i reached this far then the nanny is not cached
    // hence i will return from the firebase data
    // Then i will set this to the redis cache
    // for consistency of data, I am setting the expiery time of the cache to be 1 hour
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); // cache for 1 hour
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
    // If any update happens I will delete the cached data from redis for consistency
    await redisClient.del(`nanny:${id}`); // Invalidate cache
  } catch (e) {
    console.log(e);
    throw new Error("Error updating nanny data");
  }
};

app.get("/getNanny/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let data = await getNannyById(id);
    console.log("NANNYDATA", data);
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/updateNanny/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    await updateNannyData(id, updatedData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getParentById(id) {
  try {
    // Creating cache key
    const cacheKey = `parent:${id}`;
    const cachedParent = await redisClient.get(cacheKey);

    // checking if the parent is already cached or not
    // if it is cached i will return it from my redis cache
    if (cachedParent) {
      console.log("Serving from Cache");
      return JSON.parse(cachedParent);
    }

    const parentDocRef = doc(db, "Parent", id);
    const docSnapshot = await getDoc(parentDocRef);

    // If i reached this far then the parent is not cached
    // hence i will return from the firebase data
    // Then i will set this to the redis cache
    // for consistency of data, I am setting the expiery time of the cache to be 1 hour
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); // cache for 1 hour
      return data;
    } else {
      throw new Error("No parent exists");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error getting parent document");
  }
}

const updateParentData = async (id, obj) => {
  const parentDocRef = doc(db, "Parent", id);
  try {
    await runTransaction(db, async (transaction) => {
      const parentDoc = await transaction.get(parentDocRef);
      if (!parentDoc.exists()) {
        throw new Error("Document doesn't exist!!");
      }
      transaction.update(parentDocRef, obj);
    });
    // If any update happens I will delete the cached data from redis for consistency
    await redisClient.del(`parent:${id}`); // Invalidate cache
  } catch (e) {
    console.log(e);
    throw new Error("Error updating parent data");
  }
};

app.get("/getParent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let data = await getParentById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/updateParent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    console.log("DATA", updatedData);
    await updateParentData(id, updatedData);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
