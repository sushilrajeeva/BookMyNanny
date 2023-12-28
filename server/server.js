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
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
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

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
// Reference -> https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body, // Raw body is used here
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Check if the event type is 'checkout.session.completed'
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const listingID = session.metadata.listingID; // Extract the listingID from session metadata

      try {
        // Perform your business logic here
        await jobClose(listingID);
        console.log("Job closed successfully for listing:", listingID);
        return res.status(200).json({ received: true, closed: listingID });
      } catch (error) {
        // Error handling for your business logic
        console.error("Error in jobClose:", error);
        return res.status(500).send(`Error closing job: ${error}`);
      }
    } else {
      // Handling other event types or unhandled events
      console.log("Received unhandled event type:", event.type);
      return res
        .status(200)
        .json({ received: true, unhandled_event: event.type });
    }
  }
);
app.use(express.json());

app.get("/s3Url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { transaction } = req.body;
    let totalAmount = 0;
    const payerID = transaction[0].payerID;
    const payeeID = transaction[0].payeeID;
    const listingID = transaction[0].listingID;
    console.log("payerID", payerID);
    console.log("payeeID", payeeID);
    console.log("listingID", listingID);
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
      metadata: { listingID: listingID },
      success_url: `${process.env.CLIENT_URL}/PaymentSuccessPage`,
      cancel_url: `${process.env.CLIENT_URL}/paymentFailure`,
    });

    console.log("stupppdaflkajf");

    return res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
});

async function jobClose(listingId) {
  try {
    const listingDocRef = doc(db, "Listings", listingId);
    const listing = await getDoc(listingDocRef);

    if (listing) {
      const { progressBar } = listing.data();
      if (progressBar === 0) {
        await updateDoc(listingDocRef, { progressBar: 100 });
      } else {
        throw "Job is already completed.";
      }
    } else {
      throw "Listing does not exist.";
    }
  } catch (error) {
    console.error("Error verifying job:", error);
    return null;
  }
}

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
