import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DbConnection = async () => {
  try {
    const Conn = await connect(process.env.DATABASEURI);

    console.log(`✅ Database Connected: ${Conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.error("❌ Please check your MongoDB connection string and network connectivity");
  }
};
export default DbConnection;
