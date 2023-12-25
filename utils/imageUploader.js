var cloudinary = require('cloudinary').v2;
exports.uploadimage=async(file,folder,height,quality)=>{
try {
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }

    options.resource_type ="auto";
    return await cloudinary.uploader.upload(file.tempfilepath,options);
} catch (error) {
    return res.json({
        message:"File upload error",
        status:false
    })
}
};