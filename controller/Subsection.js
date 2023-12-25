const section=require("../Model/Section");
const subsection=require("../Model/SubSection");
const { uploadimage } = require("../utils/imageUploader");

exports.createSubsection=async(req,res)=>{
    try {
        const{title,timeduration,description,sectionId}=req.body;

        const video=req.files.videofile;

        if(!title || !timeduration || !description || !sectionId || video){
            return res.status(500).json({
                message:"All Filed Required",
                status:false
            })
        }

        const uploadDetaile=await uploadimage(video,process.env.FOLDER_NAME);

        const SubSectionDetail=await subsection.create(sectionId,{
            title:title,
            timeduration:timeduration,
            description:description,
            VideoUrl:uploadDetaile.secure_url
        })

        return res.json({
            message:"Subsection created sucessfully",
            status:true
        })
     
        
    } catch (error) {
        return res.json({
            message:"Subsection not created ,please try again",
            status:false
        })
    }
}

//update sub section
exports.updateSubsection=async(req,res)=>{

    try {
        const{title,timeduration,description,sectionId} = req.body;

        if(!title || !timeduration || !description || !sectionId ||!VideoUrl){
            return res.json({
                message:"Missing Properties",
                  status:false
            })
        }
        await subsection.findByIdAndUpdate(sectionId,{
            title,
            timeduration,
            description,
            VideoUrl,
        },{new:true})

        return res.status(200).json({
            message:"Section Updated Successfully",
            status:true
        })
    } catch (error) {
        return res.status(500).json({
            message:"Unable to upadte,Please Try Again",
            status:false,
            error:error.message,
        })
    }
}
// delete subsection

exports.deletesubSection=async(req,res)=>{
    try {
        const{sectionId} = req.param;
    await subsection.findByIdAndDelete(sectionId);
     return res.status(200).json({
        message:'Section succesfully deleted',
        status:true
     })
    } catch (error) {
        return res.status(500).json({
            message:'Unable to delete section',
            status:false
         })  
    }
}
