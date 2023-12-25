const mongoose=require("mongoose");

const CourseProgreeSchema=new mongoose.Schema({
    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVideo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection"
        }
    ]

})
module.exports=mongoose.model("CourseProgress",CourseProgreeSchema);