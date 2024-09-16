const section = require("../Model/Section");
const subsection = require("../Model/SubSection");
const { uploadimage } = require("../utils/imageUploader");
const videouploader = require("../utils/videoUploader");

exports.createSubsection = async (req, res) => {
  try {
    const { title, timeduration, description, sectionId } = req.body;
    console.log("tille", title);
    console.log("dis", description);

    console.log("id", sectionId);
    const video = req.files.VideoUrl;

    console.log("video", video);
    if (!title || !timeduration || !description || !sectionId || !video) {
      return res.status(500).json({
        message: "All Filed Required",
        status: false,
      });
    }

    const uploadDetaile = await videouploader(video.tempFilePath, process.env.FOLDER_NAME);
    console.log("Upload Detail",uploadDetaile.secure_url)
    const SubSectionDetail = await subsection.create({
        sectionId:sectionId,
        title: title,
        timeduration: timeduration,
        description: description,
        VideoUrl: uploadDetaile.secure_url, 
      });

    console.log("section", SubSectionDetail);

    return res.json({
      message: "Subsection created sucessfully",
      status: true,
    });
  } catch (error) {
    return res.json({
      message: "Subsection not created ,please try again",
      status: false,
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
