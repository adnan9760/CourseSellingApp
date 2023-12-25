const User = require("../Model/User");
const crypto = require("crypto");
const mailsenser= require("../utils/mailSender");
const bcrypt =require("bcrypt");

exports.Sendresetpasswordmail= async(req,res)=>{

    try {
        const userexist= await User.findOne(email);
    if(!userexist){
        return res.status(404).json({
            message:"User not Registered",
            status:false
        })
    }
    const token = crypto.randomUUID();

    const updateuser= await User.findOneAndUpdate({email:email},
        {
            email:email,
            resetPasswordExpire:Date.now() + 5*60*1000,
        },
        {new:true}
        )
  const url=`http://localhost:3000/update-password/${token}`

   await mailsenser(email,"Password Rest Link",`Password Reset Link:${url}`);

    return res.status(200).json({
        message:"Email Sent Successfully",
        status:true
    })
    } catch (error) {
        return res.status(404).json({
            message:"Something went wrong ",
            status:false
        })
    }



}

exports.resetpassword= async(req,res)=>{

    try {
        const{token,newPassword,confirmpassword} = req.body;

    if(newPassword !== confirmpassword){
        return res.status(404).json({
            message:"password does not match",
            status:false
        })
    }

    const userdetail= await User.findOne({token:token});

    if(!userdetail){
        return res.status(404).json({
            message:"token not valid",
            status:false
        })
    }
//token time check

if(userdetail.resetPasswordExpire > Date.now()){
    return res.status(404).json({
        message:"token Expire",
        status:false
    })
}
const hashpassword=await bcrypt.hash(newPassword,10);

await User.findOneAndUpdate({token:token},
    {
        password:hashpassword, 
    },
    {new:true}
    )

   return res.status(200).json({
    message:"Reset Password Succesfully",
    status:true
   })  
    } catch (error) {
        return res.status(404).json({
            message:"something Went wrong",
            status:false
           }) 
    }
}

