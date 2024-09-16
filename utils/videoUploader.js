const cloudinary = require("cloudinary").v2;

async function videouploader(file, folder) {
  console.log("Inside Cloudinary Video Uploader");

  try {
    console.log("Uploading file:", file);

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "video",
      folder: folder 
    });

    console.log("Upload result:", result);
    return result;

  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}

module.exports = videouploader; 
