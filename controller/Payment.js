const{instance}=require("../config/razorpay");
const User= require("../Model/User");
const course=require("../Model/Course");
const mailsender= require("../utils/mailSender");
const { default: mongoose } = require("mongoose");


exports.capturestate=async(req,res)=>{
    try {
        const{courseid}=req.body;
        const userid=req.user.id;
        const courseDetail= await course.findById(courseid);
        if(!userid || ! courseid){
            return res.json({
                message:"Missing properties",
                status:false
            })
        }

      try {
        
        if (!courseDetail){
            return res.status(500).json({
                massage:"Course not exist",
                status:false
            })
        }
        const uid= new mongoose.Types.ObjectId(userid);
        if(courseDetail.studentEnrolled.includes(uid)){
            return res.status(200).json({
                message:"Already Enrollled in Course "
            })
        }
      } catch (error) {
        return res.status(500).json({
            massage:"Course fetching Error",
            status:false
        })
      }
      const amount=courseDetail.price;
      const currency="INR"

      const option={
        amount:amount*100,
        currency,
        reciept:Math.random(Date.now().toString()),
        notes:{
            userid,
            course_id:courseid
        }
      }

      const orderCreated= await instance.orders.create(option);


      return res.status(200).json({
        success:true,
        courseName:courseDetail.title,
        coursethumbnail:courseDetail.thumbnail,
        Amount:orderCreated.amount
      })

      
       
    } catch (error) {
      return res.status(500).json({
        message:"faild Please try Again"
      })  
    }
}

exports.paymentAuth=async(req,res)=>{
    
   
        const WebhookSecret_key="1234678";
      const signature=req.header("x-rozarpay-signature");
      const shasum= crypto.createHmac("sha256",WebhookSecret_key);
      shasum.update(JSON.stringify(req.body));
      const digest=shasum.digest("hex");
      try {
        if(digest === signature){

            console.log("Payment is Authorised");
            const{userid,courseid}=req.body.payload.payment.entity.notes;
            const enrolledcourse= await course.findByIdAndUpdate(courseid,{
                $push:{
                    studentEnrolled:userid
                }
            },{
                new:true
            })
            if(!enrolledcourse){
                return res.status(500).json({
                    message:"Course Not Found",
                    status:false
                })
            }
           const enrolledStuednt=await User.findByIdAndUpdate(userid,{
            $push:{
                courses:courseid
            }
           },{
            new:true,
           }) 
           //send the Mail You are Enrolled 
           return res.status(200).json({
            message:"You Are succesfully Purchase ",
            status:true
            
           })
        }
      } catch (error) {
        return res.status(500).json({
            message:"Please Try Again ,",
            status:false
        })
      }
        
}