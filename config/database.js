const mongoose=require("mongoose");
require("dotenv").config();
 exports.connect=()=>{
mongoose.connect(process.env.URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("DB connected Succesfully");
})
.catch((error)=>{
    console.log("DB not Connected");
    console.log(error);
    process.exit(1);
})
 }