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
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
      },
 })
 module.exports=mongoose.model("SubSection",SubSectionSchema);