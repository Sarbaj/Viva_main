import express from 'express';
import router from './routes/Router.js';
import DbConnection from './db/Db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app=express()
app.use(express.json());

const allowedOrigin = "https://vivaportal.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
const PORT=process.env.PORT || 5050;
app.get('/',(req,res)=>{
    res.send("Server Is Up")
})

app.use('/bin',router)


//middlewares
 DbConnection()


export default app

