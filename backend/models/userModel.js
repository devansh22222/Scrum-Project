const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required : true,
    },

    age: {
        type: Number,
        required: true,
        min: [18, "Age must be above 18"]
    },

    email: {
        type: String,
        required : true,
        unique : true,
    },
    password : {
        type: String,
        required: true,
    },
    

})

const User = mongoose.model("User", userSchema)


module.exports = User;