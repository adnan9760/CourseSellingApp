const Rating= require("../Model/RatingAndReview");
const course=require("../Model/Course");
const { default: mongoose } = require("mongoose");
const RatingAndReview = require("../Model/RatingAndReview");
//create Review,
exports.createReview = async (req, res) => {
    try {
      const { rating, review, courseId } = req.body;
      const userId = req.user.id;
  
      const coursedetail = await course.findOne({
        _id: courseId,
        studentEnrolled: { $elemMatch: { $eq: userId } },
      });
      console.log(coursedetail)
  
      if (!coursedetail) {
        return res.status(404).json({
          message: "User not Enrolled in the Course",
          status: false,
        });
      }
  
      const alreadyreview = await Rating.findOne({
        user: userId, // Use "user" instead of "id"
        Course: courseId,
      });
  console.log(alreadyreview)
      if (alreadyreview) {
        return res.status(404).json({
          message: "User Already Reviewed",
          status: false,
        });
      }
  
      const createReview_rating = await Rating.create({
        user: userId,
        rating: rating,
        review: review,
        Course: courseId,
      });
      console.log(createReview_rating)
      const updateCourse = await course.findByIdAndUpdate(
        courseId, 
        {
          $push: {
            ratingAndReview: createReview_rating,
          },
        },
        { new: true }
      );
  
      console.log("Updated course:", updateCourse);
  
      return res.status(200).json({
        message: "Review Created Successfully",
        status: true,
        data:createReview_rating,
      });
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({
        message: "Something went wrong",
        status: false,
      });
    }
  };
  
exports.GetAvgReviews = async(req,res)=>{
    try {
        console.log("hiiiiiii")
        const { courseId }= req.query;
         console.log("iddddddddddd",courseId)
        const calculateAvgReview = await Rating.aggregate([
            {
                $match:{
                    Course:new mongoose.Types.ObjectId(courseId),
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



exports.getAllReview = async (req, res) => {
  try {
    const reviews = await Rating.find({})
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "Course",
        select: "title",
      });

    return res.status(200).json({
      message: "All reviews fetched successfully",
      status: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return res.status(500).json({
      message: "Something went wrong",
      status: false,
      error: error.message, // Include the error message for debugging
    });
  }
};




exports.fetchAllReview = async (req, res) => {
    try {
        const { courseId } = req.query;
      console.log("id",courseId)
      if (!courseId) {
        return res.status(400).json({
          message: "courseId is required",
          status: false,
        });
      }
  
      console.log("courseId", courseId);
  
      const ratingAndReview = await RatingAndReview.find({ Course: courseId })
        .populate({
          path: "user", 
          select: "firstName", 
        })
        
  
      if (!ratingAndReview || ratingAndReview.length === 0) {
        return res.status(404).json({
          message: "No reviews found for this course",
          status: false,
        });
      }
  
      console.log("Rating and review data:", ratingAndReview);
  
      return res.status(200).json({
        message: "Rating and review fetched successfully",
        status: true,
        data: ratingAndReview,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({
        message: "Something went wrong",
        status: false,
      });
    }
  };
  