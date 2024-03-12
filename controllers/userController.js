import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const register =catchAsyncError(async (req,res,next)=>{
    const {name,email,phone,role,password}=req.body;
    if(!name||!email||!phone||!role||!password){
        return next(new ErrHandler("Please fill full registration form!",400));
    }

    User.findOne({ email })
    .then(user => {
        if (user) {
            return next(new ErrHandler("Email already exists"));
        } 
    });
    const user =await User.create({
     name,email,phone,role,password,
    });

    sendToken(user,200,res,"User registered successfully!");
    // res.status(200).json({
    //     success:true,
    //     message:"user registered!",
    //     user,
    // });
});

export const login = catchAsyncError(async (req,res,next)=>{
    const {email,password,role}=req.body;
    if(!email||!role||!password){
        return next(new ErrHandler("Please fill full login form!"));
    }

    const user =await User.findOne({email});
    if(user.role!==role){
        return next(new ErrHandler("user with this role not found!"));
    }
    if(!user){
        return next(new ErrHandler("Invalid email or password!",400));
    }

    const ispassord_correct =await user.comparePassword(String(password));
        if (!ispassord_correct) {
            return next(new ErrHandler("Invalid email or password!",400));
        }
   
    sendToken(user,200,res,"User login successfully!");
});

export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    }).json({
        status:true,
        message:"Logout Successfully"
    });
});

export const getuser=catchAsyncError(async(req,res,next)=>{
    const us=req.user;
    console.log(req.user);
    res.json({
        success:true,
        message:"See your profile",
        us
    })
})