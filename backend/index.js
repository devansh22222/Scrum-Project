require("dotenv").config();
const express = require("express")
const app = express();
const port = 3000;
const cors = require("cors")
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongodb");
const authRouter = require("./routes/authRoute");
connectDB()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());


app.listen(port, ()=>{
    console.log("Server Started")
})

app.get("/", (req,res)=>{
    res.send("Server Started")
})

app.use("/api/auth", authRouter)