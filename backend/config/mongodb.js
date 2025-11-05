const mongoose = require("mongoose")

async function connectDB() {

    mongoose.connection.on("connected", ()=>{
        console.log("connected to DB")
    })

    await mongoose.connect(`${process.env.MONGO_URL}/auth`)
    
}

module.exports = connectDB;