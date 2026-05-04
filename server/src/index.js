import express from "express";
import connectDB from "./config/db.js"
import "dotenv/config"
import cookieParser from 'cookie-parser'
import authRouter from "./routes/auth.route.js"

const PORT = process.env.PORT || 5001

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRouter);


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`app is listening on port ${PORT}`)
    })
})