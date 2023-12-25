const User=require("../Model/User");
const OTP=require("../Model/OTP");
const otpGenerator=require("otp-generator");
const bcrypt =require("bcrypt");
const Profile = require("../Model/Profile");
const jwt = require("jsonwebtoken");
const cookies=require("cookies-parser");
//sendotp
exports.sendOTP = async(req,res)=>{
    try {
        const{email} = req.body();
    const userexist= await User.findOne({email});
    if(userexist){
        return res.status(401).json(
            {
                success:false,
                Message:"User Already Exist"
            }
        )
    }
    var otp= otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });
    console.log("OTP Generated",otp);4

    let result=await OTP.findOne({otp:otp});
    while(result){
        otp= otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        result=await OTP.findOne({otp:otp});

    }
    const otpPayLoad={email,otp};
    const otpBody=await OTP.create(otpPayLoad);
    console.log(otpBody);

    res.status(200).json({
        success:true,
        Message:"Otp sent succesfully"
    })
    } catch (error) {
        res.status(501).json({
            success:false,
            Message:"Otp not  sent succesfully"
        })
    }

}
//signup
exports.Signup = async(req,res)=>{
    try {
        const {
     firstName,
     lastName,
     email,
     password,
     confirmpassword,
     contactNumber,
     accountType,
     otp,
     PhoneNumber
        } =req.body;
        if(!firstName || !lastName || !email || !password || !confirmpassword || !otp){
            return res.status(403).json({
                success:false,

                Message:"All Field are Required "
            })
        }
        if(password !== confirmpassword){
            return res.status(403).json({
                success:false,

                Message:"Password doesnt match!! "
            })
        }
        const userexist=await User.findOne({email});
        if(userexist){
            return res.status(403).json({
                success:false,

                Message:"Already Exist Please Login"
            })
        }
        const recentOtp=await OTP.find({email}).sort({createAt:-1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length ==0){
            return res.status(403).json({
                success:false,

                Message:"OTP not found "
            })
        }
        else if(otp !== recentOtp.otp){
            return res.status(403).json({
                success:false,

                Message:"Invalid OTP "
            })
        }
        const hashpassword=await bcrypt.hash(password,10);
          const ProfileDetail=await Profile.create({
            gender:null,
            dateofbirth:null,
            about:null,
            PhoneNumber:null
          })
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashpassword,
            contactNumber,
            accountType,
            additionalDetail:ProfileDetail._id,
            Image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        return res.status(403).json({
            success:true,
            
            Message:"User Succesfully Registered"
        })

    } catch (error) {
        return res.status(503).json({
            success:false,

            Message:"User cannot be registred,Please try again"
        })
    }
}

//login
exports.Login=async(req,res)=>{
    try {
        const{email,password}=req.body;
        if(!email || !password){
            return res.json({
                success:false,
                Message:"All field are required"
            })
        }
        const user=await User.findOne({email:email});
        if(!userexist){
            return res.json({
                Message:"Please Register",
                success:false
            })
        }
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;
           const option={
           expires:new Date(Date.now() + 3*24*60*60*1000)
           }
            res.cookies("token",token,option).status(200).json({
                Message:"Logging Successfully",
                token,
                user,
                success:true
            })
        }
        else{
            return res.status(401).json({
                success:false,
                Message:"Password is incorrectly"
            })
        }

    } catch (error) {
        return res.json({
            Message:"Login failure",
         success:false
        })
    }
};

//ChangePassword
exports.changePassword=async(req,res)=>{
    try {
        const{email,currentpass,password,confirmpassword}=req.body;
         if(password !==confirmpassword){
            return res.status(404).json({
                Message:"Password does not Match",
                status:false,
            })
         }
        const userexist= await User.findOne({
            email:email
        });
        if(!userexist){
            return res.status(404).json({
                Message:"User not Exist",
                status:false
            })
        }
       const findprev= userexist.password;

       const hashcurrent= await bcrypt.hash(currentpass,10);

       if(hashcurrent !== findprev){
        return res.status(404).json({
            Message:"Current Password does not Match",
            status:false,
        })
       }

       const hashnewPassword = await bcrypt.hash(password,10);

       await User.findOneAndUpdate({
        email:email,
       },
       {
        password:hashnewPassword,
       },{new:true}
       );

       return res.status(200).json({
        Message:"Password change Succcesfully",
        status:true
       })
        
    } catch (error) {
        return res.status(404).json({
            Message:"Something went  wrong ",
            status:false,
        })
    }
}