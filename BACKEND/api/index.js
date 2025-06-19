// api/index.js
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import DbConnection from '../db/Db.js';
import router from '../routes/Router.js';

dotenv.config();

const app = express();

// Setup CORS
app.use(cors({
  origin: ["https://vivaportal.vercel.app"],
  credentials: true
}));

app.use(express.json());

// Ensure DB connection only once
let connected = false;
app.use(async (req, res, next) => {
  if (!connected) {
    await DbConnection();
    connected = true;
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Vercel Serverless API is working");
});

app.use("/bin", router);

export const handler = serverless(app); // 👈 Serverless-compatible export
