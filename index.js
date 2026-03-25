import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js";
import cors from "cors"
import dotenv from "dotenv"
import orderRouter from "./routes/orderRouter.js";

dotenv.config()

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(express.json());
app.use(cors()) 

// middleware start
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization")
        if(token != null){
            token = token.replace("Bearer ","")
            
            jwt.verify(token,process.env.JWT_SECRET,(err , decoded)=>{
                 if(decoded == null){
                    res.json({
                        message : "invalied token. plz login again"
                    })
                    return;
                 }else{
                   
                    req.user = decoded
                 }
            })
        }
        next()
    }
)
// end of the middleware

const cstring = process.env.MONGO_URI
mongoose.connect(cstring)
    .then(() => {
        console.log("database connected successfully");
       
    })
    .catch((err) => {
        console.log("database connection failed..!");
        console.log(err.message);
        
    });



app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/orders",orderRouter)

app.listen(5000,
    () => {
        
        console.log("server is running on port 5000");
        
    }
);