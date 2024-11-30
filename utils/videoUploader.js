const cloudinary = require("cloudinary").v2;

async function videouploader(file, folder) {

  try {
    let result = await cloudinary.uploader.upload(file, {
      resource_type: 'video',
      folder: folder,
    });

    return result;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}

module.exports = videouploader;
