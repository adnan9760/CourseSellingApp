const mongoose=require("mongoose");
 const CourseSchema=new mongoose.Schema({
 title:{
    type:String
 },
 desc:{
    type:String
 },
 instructor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
 },
 whatwillyoulearn:{
    type:String,
 },
 coursecontent:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Section"
 },
 price:{
    type:Number
 },
 thumbnail:{
    type:String
 },
 ratingAndReview:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"RatingAndReview"
 },
 tag:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Tag"
 },
 studentEnrolled:[
   {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
   }
 ],


 })
 module.exports=mongoose.model("Course",CourseSchema);