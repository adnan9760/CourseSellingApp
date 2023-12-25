const Rating= require("../Model/RatingAndReview");
const course=require("../Model/Course");
const { default: mongoose } = require("mongoose");
//create Review,
exports.createReview = async(req,res)=>{
    try {
        const courseId= req.body;
        const rating =req.body;
        const review = req.body;

        const userId =req.user.id;

        const coursedetail= await course.findById(
            {courseId},
            {studentEnrolled:{$elemMatch:{$eq:userId}}}
        );

        if(!coursedetail){
            return res.status(404).json({
                message:"User not Enrolled in the Course",
                status:false
            }
              
            );
        }

        const alreadyreview= await Rating.findOne(
            {
                id:userId,
                Course:courseId    
            }

        );

        if(alreadyreview){
            return res.status(404).json({
                message:"User Already Review",
                status:false
          
            }
            )
        }

        const createReview_rating= await Rating.create({
            user:userId,
            rating:rating,
            review:review,
            Course:courseId
        })

  const updateCourse = await course.findByIdAndUpdate({courseId},
{$push:{
    ratingAndReview:createReview_rating,
  }  
},
{new:true}
  )
  
   return res.status(200).json({
    message:"Review Created Successfully",
    status:true,
   })

        
        
    } catch (error) {
        res.status(404).json({
    message:"Something went Wrong",
    status:false,
   })
    }
}
// calculate Review
exports.GetAvgReviews = async(req,res)=>{
    try {

        const CourseId= req.body;
        const calculateAvgReview = await Rating.aggregate([
            {
                $match:{
                    Course:new mongoose.Types.ObjectId(CourseId),
                }
            },
            {
                $group:{
                    _id:null,
                    AverageRating:{$avg:"$rating"}
                }
            }
        ]) 
        if(calculateAvgReview.length >0){
            return res.status(200).json({
                message:"Calculate Avg Rating",
                status:true,
                AvgRating:calculateAvgReview[0].AverageRating,
            })
        }
    } catch (error) {
        res.status(404).json({
            message:"Something went Wrong",
            status:false
    }
        )
}
}

// get All Review

exports.getAllReview= async(req,res)=>{
    try {
        await Rating.find({},
            
            ).populate({
                path:"rating"
            }).populate({
                path:"review"
            }).populate({
                path:"user",
                select:"firstName lastName email image"
                
            })
            .populate({
                path:"Course",
                select:"title"
            }).exec();

            return res.status(200).json({
                message:"All  review fetch",
                status:true,

            })
    } catch (error) {
        res.status(404).json({
            message:"Something went Wrong",
            status:false
    }
        )
    }
}