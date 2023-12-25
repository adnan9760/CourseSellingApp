const jwt=require("jsonwebtoken");
require("dotenv").config();
const User = require("../Model/User");
//auth
exports.auth = async(req,res,next)=>{
    try {
        const token = req.cookies.token || req.body.token || req.header("Auth",
        );
        if(!token){

            return res.json({
                 message:"Token is missing",
                 success:false
            })
        }
        try {
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        } catch (error) {
            return res.json({
                message:"Token is not verify",
                success:false
            })
        }
 
    } catch (error) {
        return res.json({
            message:"something error while veriry the token",
            success:false
        })
    }
    next();
}
//Isadmin
exports.Isadmin = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.json({
                message:"This is only for admin ",
                success:false
            })
        }
    } catch (error) {
        return res.json({
            message:"something error occure",
            success:false
        })
    }
    next();
}
//Isstudent
exports.Isadmin = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Stuednt"){
            return res.json({
                message:"This is only for Student ",
                success:false
            })
        }
    } catch (error) {
        return res.json({
            message:"something error occure",
            success:false
        })
    }
    next();
}
//Isinstructor
exports.Isinstructor = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.json({
                message:"This is only for Instructor ",
                success:false
            })
        }
    } catch (error) {
        return res.json({
            message:"something error occure",
            success:false
        })
    }
    next();
}

