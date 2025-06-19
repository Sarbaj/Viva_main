    import express from 'express';
import serverless from 'serverless-http';
import DbConnection from '../db/Db.js';
import router from '../routes/Router.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// CORS
app.use(cors({
  origin: ["https://vivaportal.vercel.app"],
  credentials: true,
}));

app.use(express.json());
DbConnection();

app.get('/', (req, res) => {
  res.send("Server is up (via Vercel)");
});
app.use('/bin', router);

// Export as Vercel function
export const handler = serverless(app);
