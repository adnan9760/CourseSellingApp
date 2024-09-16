const cloudinary = require('cloudinary').v2;
// async function uploadfiletocloudinary(file , folder){
//     const option ={folder};

//     return await cloudinary.uploader.upload(file.tempFilePath,option);
// }
exports.uploadimage=async(thumbnail,folder)=>{
try {
    
    const options={folder};
    // if(height){
    //     options.height=height;
    // }
    // if(quality){
    //     options.quality=quality;
    // }
  
    
    options.resource_type ="auto";
   

    return  cloudinary.uploader.upload(thumbnail.tempFilePath,options);
    
} catch (error) {
    return res.json({
        message:"File upload error",
        status:false
    })
}
};