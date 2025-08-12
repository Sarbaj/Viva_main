import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DbConnection from "./db/Db.js";
import router from "./routes/Router.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["https://vivaportal.vercel.app", "http://localhost:5173/"],
    credentials: true,
  })
);
app.use(express.json());

DbConnection(); // MongoDB connect

app.get("/", (req, res) => res.send("Server running"));

app.use("/bin", router);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
