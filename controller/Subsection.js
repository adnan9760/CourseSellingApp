const section = require("../Model/Section");
const subsection = require("../Model/SubSection");
const { uploadimage } = require("../utils/imageUploader");
const videouploader = require("../utils/videoUploader");

exports.createSubsection = async (req, res) => {
  try {
    const { title, timeduration, description, sectionId } = req.body;
    const video = req.files.VideoUrl;
    if (!title || !timeduration || !description || !sectionId || !video) {
      return res.status(400).json({
        message: "All fields are required.",
        status: false,
      });
    }
    const uploadDetail = await videouploader(
      video.tempFilePath,
      process.env.FOLDER_NAME
    );
    console.log("Upload Detail:", uploadDetail.secure_url);

    const SubSectionDetail = await subsection.create({
      sectionId: sectionId,
      title: title,
      timeduration: timeduration,
      description: description,
      VideoUrl: uploadDetail.secure_url,
    });

    const sectiondoc = await section.findById(sectionId);
    console.log("sectionid", sectiondoc);
    if (!sectiondoc) {
      return res.status(404).json({
        message: "Section not found.",
        status: false,
      });
    }
    sectiondoc.subSection.push(SubSectionDetail._id);
    await sectiondoc.save();

    return res.json({
      message: "Subsection created successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error creating subsection:", error);
    return res.status(500).json({
      message: "Subsection not created, please try again.",
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

exports.updateSubsection = async (req, res) => {
  try {
    const { title, timeduration, description, sectionId } = req.body;

    if (!title || !timeduration || !description || !sectionId || !VideoUrl) {
      return res.json({
        message: "Missing Properties",
        status: false,
      });
    }
    await subsection.findByIdAndUpdate(
      sectionId,
      {
        title,
        timeduration,
        description,
        VideoUrl,
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
// delete subsection

exports.deletesubSection = async (req, res) => {
  try {
    const { sectionId } = req.param;
    await subsection.findByIdAndDelete(sectionId);
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
//fetch Subsection
exports.getSubsection = async (req, res) => {
  try {
    const { sectionId } = req.query;  
    console.log("id ", sectionId);

    const subsectionwithsection = await section
      .findById(sectionId)
      .populate("subSection");
    
    console.log("sect", subsectionwithsection);

    if (!subsectionwithsection) {
      return res.json({
        message: "Section not found",
        status: false,
      });
    }
    return res.status(200).json({
      message: "Section with subsections retrieved successfully",
      status: true,
      data: subsectionwithsection,
    });
  } catch (error) {
    console.error("Error fetching section with subsections:", error);
    return res.status(500).json({
      message: "Error fetching section",
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};


