const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/userModel")


const register = async (req,res)=>{
    const {name, age, email, password} = req.body

    if(!name || !age || !email || !password){
        return res.json({success: false, message : "Please fill all the details"})
    }

    try {
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.json({success: false, message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            age: age,
            email:email,
            password: hashedPassword
        })

        await user.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"})

        res.cookie("token", token, {
            httpOnly: true,
            secure : process.env.NODE_ENV  === "production",
            sameSite:  process.env.NODE_ENV  === "production" ? "none" : "strict",
            maxAge: 7*24*60*60*1000
        })
        return res.json({success: true, message: "User registered succesfully"})

    } catch (error) {
        console.log(error)
        return res.json({success: false, message: error.message})
        
    }
}

const login = async (req,res)=>{
    const {email, password} = req.body

    if(!email || !password){
        return res.json({success: false, message: "Please fill all details"})
    }

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.json({success: false, message: "User Doesn't exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "Wrong password"})
        }

         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"})

        res.cookie("token", token, {
            httpOnly: true,
            secure : process.env.NODE_ENV  === "production",
            sameSite:  process.env.NODE_ENV  === "production" ? "none" : "strict",
            maxAge: 7*24*60*60*1000
        })
        return res.json({success: true, message: "User logged In succesfully"})

    } catch (error) {
        console.log(error)
        return res.json({success: false, message: error.message})
    }
}

const logout = async (req,res)=>{
    try {
        res.clearCookie("token", {
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })

        return res.json({success: true, message: "Logged out"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

module.exports = {register, login}