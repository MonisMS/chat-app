import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/userRoutes.js"
dotenv.config()
const PORT = process.env.PORT || 5000;
const app= express();
const server = http.createServer(app)  //socket io uses http


app.use(express.json({limit:"4mb"}))
app.use(cors())

app.use("/api/status", (req,res) => res.send("Server is live "))
app.use("/api/auth", userRouter)
await connectDB()
app.listen(PORT,() =>{
    console.log(`server running on http://localhost:${PORT}`);
    
})