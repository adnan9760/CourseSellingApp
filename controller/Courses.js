const course = require("../Model/Course");
const Tagdata = require("../Model/Tag");
const User = require("../Model/User");
const { uploadimage } = require("../utils/imageUploader");

exports.Createcourse = async (req, res) => {
  console.log("Inside create course");
  try {
    const { courseName, CourseDescription, WhatWillYouLearn, price, Tag } =
      req.body;
  console.log(courseName)
    if (
      !courseName ||
      !CourseDescription ||
      !WhatWillYouLearn ||
      !price ||
      !Tag
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
        status: false,
      });
    }

    const thumbnail = req.files.thumbnailImage;
    console.log(thumbnail)
    const userId = req.user.id;
    console.log("userid",userId);
    const instructorDetail = await User.findById(userId);

    if (!instructorDetail) {
      return res.status(404).json({
        message: "Instructor not found",
        status: false,
      });
    }

    const TagDetails = await Tagdata.findOne({ name: Tag });

    if (!TagDetails) {
      return res.status(404).json({
        message: "Tag not found",
        status: false,
      });
    }

    const thumbnailImage = await uploadimage(thumbnail, "Adnan photo");

    const NewCourse = await course.create({
      title: courseName,
      desc: CourseDescription,
      instructor: instructorDetail._id,
      price: price,
      tag: TagDetails._id,
      thumbnail: thumbnailImage,
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetail._id },
      { $push: { courses: NewCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      message: "Course created successfully",
      status: true,
      data: NewCourse
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      message: "Failed to create course",
      status: false,
      error: error.message,
    });
  }
};

exports.editcourse = async(req,res)=>{
  try {
      const courseid = req.body;


      const coursedetail = await course.findById(courseid);

     
  } catch (error) {
    
  }
}

exports.getCourseAlldetails = async (req, res) => {
  try {
    const allcoursedetail = await course
      .find(
        {},
        {
          title: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingAndReview: true,
          studentEnrolled: true,
        }
      )
      .populate("instructor")
      .exec();
    console.log(allcoursedetail);
  } catch (error) {
    return res.json({
      message: "can't fetch course Data",
      status: false,
    });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseExist = await course
      .find({ _id: courseId })
      .populate({
        path: "instructor".populate({
          path: "additionalDetail",
        }),
      })
      .populate({
        path: "ratingAndReview",
      })
      .populate({
        path: "coursecontent".populate({
          path: "subSection",
        }),
      })
      .populate({
        path: "tag",
      })
      .exec();

    if (!courseExist) {
      return res.status.json({
        status: false,
        Message: "Course Not found",
      });
    }

    return res.status.json({
      status: true,
      message: "Couse Detail Succesfully fetched",
    });
  } catch (error) {
    return res.status.json({
      status: false,
      Message: "Something Went Wrong",
    });
  }
};

exports.FetchEnrolledCourse = async (req, res) => {};
