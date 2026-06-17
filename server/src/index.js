import express from "express";
import connectDB from "./config/db.js";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listings.route.js";
import paymentRouter from "./routes/payment.route.js";
import reviewRouter from './routes/review.route.js'
import cors from "cors";

const PORT = process.env.PORT || 5050;

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/review",reviewRouter)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
  });
});
