const {instance} = require("../config/razorpay")
const User= require("../Model/User");
const course=require("../Model/Course");
const mailsender= require("../utils/mailSender");
const crypto = require('crypto');
const { default: mongoose } = require("mongoose");


exports.capturestate = async (req, res) => {
  try {
    console.log("Processing capturestate...");

    // Validate user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User is not authenticated",
        status: false,
      });
    }
    const userid = req.user.id;

    // Validate courseId
    const { courseId } = req.query;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid or missing courseId",
        status: false,
      });
    }

    // Fetch course details
    const courseDetail = await course.findById(courseId);
    if (!courseDetail) {
      return res.status(404).json({
        message: "Course does not exist",
        status: false,
      });
    }

    // Check enrollment
    const uid = new mongoose.Types.ObjectId(userid);
    if (courseDetail.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        message: "Already enrolled in the course",
        status: true,
      });
    }

    // Prepare Razorpay order options
    const amount = courseDetail.price;
    const currency = "INR";
    const options = {
      amount: amount * 100, // Amount in paisa
      currency,
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      notes: {
        userid,
        course_id: courseId,
      },
    };
    console.log("Order options:", options);

    // Create Razorpay order
    try {
      const orderCreated = await instance.orders.create(options);
      console.log("Order created:", orderCreated);
      return res.status(200).json({
        success: true,
        courseName: courseDetail.title,
        coursethumbnail: courseDetail.thumbnail,
        Amount: orderCreated.amount,
        order_id:orderCreated.id,
      });
    } catch (razorpayError) {
      console.error("Razorpay Error:", razorpayError);
      return res.status(500).json({
        message: "Failed to create Razorpay order",
        status: false,
        error: razorpayError.message,
      });
    }
  } catch (error) {
    console.error("Error in capturestate:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      message: "Failed to process request. Please try again.",
      status: false,
    });
  }
};






exports.paymentAuth=async(req,res)=>{
    
   
        const WebhookSecret_key="1234678";
      const signature=req.header("x-razorpay-signature");
      const shasum= crypto.createHmac("sha256",WebhookSecret_key);
      shasum.update(JSON.stringify(req.body));
      const digest=shasum.digest("hex");
      try {
        if(digest === signature){

            console.log("Payment is Authorised");
            const{userid,courseid}=req.body.payload.payment.entity.notes;
            console.log("user",userid);
             console.log("user",courseid);
            const enrolledcourse= await course.findByIdAndUpdate(courseid,{
                $push:{
                    studentEnrolled:userid
                }
            },{
                new:true
            });
              console.log("course",enrolledcourse);
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
