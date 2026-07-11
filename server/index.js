import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectdb.js";
import cookieParser from "cookie-parser";
dotenv.config();
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.js";
import paymentRouter from "./routes/payment.route.js";
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin: "https://ai-interview-frontend-wlvd.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRouter)

app.use('/api/user',userRouter)
app.use('/api/interview',interviewRouter)
app.use('/api/payment',paymentRouter)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
