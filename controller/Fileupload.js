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