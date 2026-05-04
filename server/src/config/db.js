import mongoose from "mongoose";
import 'dotenv/config'

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    const database = await mongoose.connect(MONGODB_URL);
    if(database){
        console.log("Connected to DataBase successfully!")
    }else{
        console.log("Connection faild")
    }
  } catch (error) {
    console.log("MongoDB Error : ",error)
  }
};

export default connectDB;