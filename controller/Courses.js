const course=require("../Model/Course");
const Tag=require("../Model/Tag");
const User=require("../Model/User");
const {uploadimage} = require("../utils/imageUploader");

exports.Createcourse=async(req,res)=>{
    try {
        const{courseName,CourseDescription,WhatWillYouLearn,price,Tag}=req.body;


    const thumbnail = req.file.thumbnailImage;

if(!courseName||!CourseDescription||!WhatWillYouLearn||!price||!Tag){
    return res.status(500).json({
        Message:"Please fill Alll filed",
        status:false
    })
}
const userid=req.userid;

const instructordetail= await User.find({userid});

console.log(instructordetail);

if(!instructordetail){
    return res.json({
        message:"Instructor not found",
        status:false
    })
}

const TagDetails=await Tag.find({Tag});
console.log(TagDetails);
if(TagDetails){
    return res.json({
        message:"Tag not found",
        status:false
    })
}
const  thumbnailImage= await uploadimage(thumbnail,env.process.FOLDER_NAME);

const NewCourse =course.create({
    title:courseName,
    desc:CourseDescription,
    instructor:instructordetail._id,
    price:price,
    tag:TagDetails._id,
    thumbnail:thumbnailImage

});

await User.findByIdAndUpdate({_id:instructordetail._id},
    {
        $push:{
            course:NewCourse._id,
        }
            
        
    },
    {new:true}
    )
 return res.status(200).json({
    message:"Courese Created Sucessfully",
    status:true,
 })
    } catch (error) {
        return res.json({
            message:"Failed created Course",
            status:false
        })
    }

}

exports.getAlldetail=async(req,res)=>{

    try {
        const allcoursedetail = await course.find({},{title:true,
        price:true,
        thumbnail:true,
        instructor:true,
        ratingAndReview:true,
        studentEnrolled:true
        }).populate("instructor").exec();
        console.log(allcoursedetail);
    } catch (error) {
        return res.json({
            message:"can't fetch course Data",
            status:false
        })
    }
};

exports.getCourseDetail=async(req,res)=>{
    try {
        const {courseId} = req.body;

        const courseExist= await course.find(
            {_id:courseId}
        ).populate({
            path:"instructor"
            .populate({
                path:"additionalDetail"
            })
        })
        .populate(
            {
                path:"ratingAndReview"
            }
        )
        .populate({
            path:"coursecontent"
            .populate(
                {
                    path:"subSection"
                }
            )
        })
        .populate({
            path:"tag"
        }).exec();


        if(!courseExist){
            return res.status.json({
                status:false,
                Message:"Course Not found"
            })
        }

       return res.status.json({
        status:true,
        message:"Couse Detail Succesfully fetched"
       })
        


    } catch (error) {
        return res.status.json({
            status:false,
            Message:"Something Went Wrong"
        })
    }
}




