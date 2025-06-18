import express from 'express';
import router from './routes/Router.js';
import DbConnection from './db/Db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app=express()
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // if you want to allow cookies/auth headers
}));
const PORT=process.env.PORT || 5050;
app.get('/',(req,res)=>{
    res.send("Server Is Up")
})
app.use('/bin',router)
app.listen(PORT,()=>{
    DbConnection()
    console.log(`Server Running On ${PORT} PORT `);
})

