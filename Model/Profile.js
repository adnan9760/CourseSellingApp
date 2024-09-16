const mongoose=require("mongoose");
 const ProfileSchema=new mongoose.Schema({
    gender:{
        type:String
    },
    dateofbirth:{
        type:Date,
    },
    about:{ 
        type:String,
        trim:true
    },
    PhoneNumber:{
        type:Number,
        trim:true
    },


 })
 module.exports=mongoose.model("Profile",ProfileSchema);