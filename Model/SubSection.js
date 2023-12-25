const mongoose=require("mongoose");
 const SubSectionSchema=new mongoose.Schema({
    title:{
        type:String
    },
    timeduration:{
        type:String
    },
    description:{
        type:String
    },
    VideoUrl:{
        type:String
    }


 })
 module.exports=mongoose.model("SubSection",SubSectionSchema);