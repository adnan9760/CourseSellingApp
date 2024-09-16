const course = require("../Model/Course");
const section = require("../Model/Section");

exports.createSection = async (req, res) => {
  console.log("inside")
  try {
    const { sectionName, CourseId } = req.body;
       console.log(CourseId);
    if (!sectionName || !CourseId) {
      return res.status(500).json({
        status: false,
        message: "All field Required",
      });
    }

    const newSection = await section.create({ sectionName: sectionName });

    const UpadteCourse = await course.findByIdAndUpdate(
      CourseId,
      {
        $push: {
          coursecontent: newSection._id,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "New Section Created Successfully",
      data: newSection,
      status: true,
    });
  } catch (error) {
    return res.json({
      message: "Section Creation failed ",
      status: false,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionName || !sectionId) {
      return res.json({
        message: "Missing Properties",
        status: false,
      });
    }
    await section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Section Updated Successfully",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to upadte,Please Try Again",
      status: false,
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.param;
    await section.findByIdAndDelete(sectionId);
    return res.status(200).json({
      message: "Section succesfully deleted",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete section",
      status: false,
    });
  }
};
