import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const DbConnection=async()=>{

    try {
        const Conn=await connect("mongodb+srv://sarbajmalek3456:ELON_MUSK2499@cluster0.xyevmbo.mongodb.net/VIVA-DB")
        if (Conn) {
            console.log(`✅ Database Connected: ${Conn.connection.host}`);
        }
        
    } catch (error) {   
        console.error('error on connection');
    }

}
export default DbConnection;