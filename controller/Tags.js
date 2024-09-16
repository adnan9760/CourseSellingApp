const Tag=require("../Model/Tag");
const  Course= require("../Model/Course");

exports.CreateTag= async(req,res)=>{
try {
    const{name,description }=req.body;

if(!name || !description){
    return res.status(500).json({
        message:"All field required",
        status:false
    })
}

const TagDetails=await Tag.create({
    name:name,
    description:description
}) ;

console.log(TagDetails);
return res.json({
    message:"Tag created Sucessfully",
    status:true,
})
} catch (error) {
    return res.json({
        message:message.error,
        status:false
    })
}
};
//get All Tags

exports.getAlldetail = async (req, res) => {
    try {
        const alldetail = await Tag.find({}, { name: true, description: true });
        console.log(alldetail);
        return res.json({
            data: alldetail,
            status: true
        });
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        return res.json({
            message: "Couldn't fetch",
            status: false
        });
    }
};


exports.getAlltag = async(req,res)=>{

    try {
        // fetch tagid

        const Tagid=req.body;
        const tagspecificcourse = await Tag.findById({
           Tagid
        })
        .populate({
            path:"course"
        }).exec();
        if(!tagspecificcourse){
            return res.status(404).json({
                message:"Tag is not valid"
            })
        }
       const DifferentCourse = await Tag.find({
        _id:{$ne:Tagid}
       }).populate({
        path:"course"
       }).exec();
        
        // fetch top sell

    } catch(error) {
        
    }
}