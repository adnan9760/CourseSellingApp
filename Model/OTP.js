const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
 const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
  
     createdAt: { type: Date, default: Date.now, expires:5 * 60 * 1000 }


 })
 async function sendverificationEmail(email,otp){
    try {
        const mailResponse= await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Email sent Successsfully",mailResponse);
    } catch (error) {
        console.log("error occured while sending mail")
    }
 }
 otpSchema.pre("save",async function(next){
    await sendverificationEmail(this.email,this.otp);
    next();
 })
 module.exports=mongoose.model("OTP",otpSchema);