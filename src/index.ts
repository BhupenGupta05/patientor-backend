import express from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";
config();

import diagnosisRouter from "./routes/diagnosis";
import patientsRouter from "./routes/patients";

const app = express();
app.use(cors());

console.log("connecting to", process.env.MONGODB_URL);
mongoose.set("strictQuery", false);


mongoose.connect(process.env.MONGODB_URL!)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.use(express.json());


app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosisRouter);
app.use("/api/patients", patientsRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});