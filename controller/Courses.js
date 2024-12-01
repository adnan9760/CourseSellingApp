const course = require("../Model/Course");
const { populate } = require("../Model/CourseProgress");
const Tagdata = require("../Model/Tag");
const User = require("../Model/User");
const { uploadimage } = require("../utils/imageUploader");

exports.Createcourse = async (req, res) => {
  try {
    const { courseName, CourseDescription, WhatWillYouLearn, price, Tag } =
      req.body;
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
    const userId = req.user.id;
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
      status: "Draft",
    });

    await User.findByIdAndUpdate(
      { _id: instructorDetail._id },
      { $push: { courses: NewCourse._id } },
      { new: true }
    );

    return res.status(200).json({
      message: "Course created successfully",
      status: true,
      data: NewCourse,
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

exports.editcourse = async (req, res) => {
  try {
    const courseid = req.body;

    const coursedetail = await course.findById(courseid);
  } catch (error) {}
};

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
    return res.status(200).json({
      message: "Course details fetched successfully",
      status: true,
      data: allcoursedetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: "can't fetch course Data",
      status: false,
    });
  }
};

exports.getCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.query;

    const courseExist = await course
      .findById(courseId)
      .populate("instructor")
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetail",
        },
      })
      .populate({
        path: "ratingAndReview",
      })
      .populate({
        path: "coursecontent",
        populate: {
          path: "subSection",
        },
      })
      .populate({
        path: "tag",
      })
      .exec();


    if (!courseExist) {
      return res.status(404).json({
        status: false,
        message: "Course Not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Course Detail successfully fetched",
      data: courseExist,
    });
  } catch (error) {
    console.error("Error fetching course detail:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

exports.Updatecourseaspublic = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        status: false,
        message: "Course ID is required",
      });
    }

    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      { status: "Published" },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        status: false,
        message: "Course not found",
      });
    }


    return res.status(200).json({
      status: true,
      message: "Course marked as public successfully",
      data: updatedCourse, 
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

exports.FetchEnrolledCourse = async (req, res) => {
  try {
    const userid = req.user.id;

    const fetchcourse = await User.findById(userid)
      .populate({
        path: 'courses', // Populate the courses array
        populate: {
          path: 'coursecontent', // Populate the coursecontent field
          populate: {
            path: 'subSection' // Populate the subSection field inside coursecontent
          }
        }
      })
      .exec();

    // Check if user is found
    if (!fetchcourse) {
      return res.status(404).json({
        status: false,
        message: "Could not fetch enrolled courses",
      });
    }

    // Return success response with course details
    return res.status(200).json({
      status: true,
      message: "Course enrollment details successfully fetched",
      data: fetchcourse,
    });
  } catch (error) {
    // Handle errors and return an error response
    console.error("Error fetching enrolled courses:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching enrolled courses",
      error: error.message,
    });
  }
};

