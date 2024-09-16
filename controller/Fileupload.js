const cloudinary = require("cloudinary").v2;
async function uploadfiletocloudinary(file , folder){
    const option ={folder};

    return await cloudinary.uploader.upload(file.tempFilePath,option);
}
exports.fileuploadcloudinary = async(req,res)=>{
    try {
        const file = req.files.file;
        console.log(file);
        //validation Remaining

        const response = await uploadfiletocloudinary(file,"courseThumnail");
        console.log("response",response);

         res.json({
            message:"Thumnail Upload Succesfully",
            success:true
        })

    } catch (error) {
        return res.json({
            message:"Something Went Wrong",
            status:false
        })
    }
}
exports.videofileupoadcloudinary= async(req, res)=>{
    try {
        const videofile=req.VideoFile.file;
        const response = await uploadfiletocloudinary(videofile ,"Adnan photo");

        res.json({
            message:"Video upload  Succesfully",
            success:true,
        })
    } catch (error) {
        return res.json({
            message:"unable to upload file"
        })
    }
}