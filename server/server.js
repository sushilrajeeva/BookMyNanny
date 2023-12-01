import express from "express";
import cors from "cors";
import { generateUploadURL } from "./s3.js";

const app = express();

app.use(cors());

app.get("/s3Url", async (req, res) => {
  const url = await generateUploadURL();
  res.send({ url });
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
