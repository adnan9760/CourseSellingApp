const OTP = require("../Model/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../Model/Profile");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const User = require("../Model/User");
const { additionaldetail } = require("./Profile");
//sendotp
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userexist = await User.findOne({ email });
    if (userexist) {
      return res.status(401).json({
        success: false,
        Message: "User Already Exist",
      });
    }
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    let otpPayLoad = { email, otp };
    const otpBody = await OTP.create(otpPayLoad);

    res.status(200).json({
      success: true,
      Message: "Otp sent succesfully",
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      Message: "Otp not  sent succesfully",
    });
  }
};
//signup
exports.Signup = async (req, res) => {
  try {
    // Add more specific logging
    const {
      firstName,
      lastName,
      email,
      password,
      confirmpassword,
      accountType,
      otp,
    } = req.body;

    // Logging inputs

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmpassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        Message: "All fields are required",
      });
    }

    if (password !== confirmpassword) {
      return res.status(403).json({
        success: false,
        Message: "Passwords do not match",
      });
    }

    const userexist = await User.findOne({ email });
    if (userexist) {
      return res.status(403).json({
        success: false,
        Message: "User already exists. Please log in.",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const userdata = await User.create({
      firstName,
      lastName,
      email,
      password: hashpassword,
      contactNumber: null,
      accountType,
      image: null,
    });


    return res.status(201).json({
      data: userdata,
      success: true,
      Message: "User successfully registered",
    });
  } catch (error) {
    console.error("Error during Signup process:", error);
    return res.status(503).json({
      success: false,
      Message: "Service temporarily unavailable. Please try again later.",
    });
  }
};


exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        Message: "All field are required",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        Message: "Please Register",
        success: false,
      });
    }

    if (!user) {
      return res.json({
        Message: "Please Enter Right Creaditial",
        success: false,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
        username:user.firstName,
      };
   

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
  
      user.token = token;
      user.password = undefined;
      user.confirmpassword = undefined;
   
      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      return res.cookie("token", token, option).status(200).json({
        Message: "Logging Successfully",
        token,
        user,
        success: true,
      });
    } else {
      return res.status(401).json({
        success: false,
        Message: "Password is incorrectly",
      });
    }
  } catch (error) {
    return res.json({
      Message: "Login failure",
      success: false,
    });
  }
};

//ChangePassword
exports.changePassword = async (req, res) => {
  try {
    const { email, currentpass, password, confirmpassword } = req.body;
    if (password !== confirmpassword) {
      return res.status(404).json({
        Message: "Password does not Match",
        status: false,
      });
    }
    const userexist = await User.findOne({
      email: email,
    });
  
    if (!userexist) {
      return res.status(404).json({
        Message: "User not Exist",
        status: false,
      });
    }
    const findprev = userexist.password;

    const hashcurrent = await bcrypt.hash(currentpass, 10);



    if (hashcurrent === findprev) {
      return res.status(404).json({
        Message: "Current Password does not Match",
        status: false,
      });
    }

    const hashnewPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        password: hashnewPassword,
      },
      { new: true }
    );

    return res.status(200).json({
      Message: "Password change Succcesfully",
      status: true,
    });
  } catch (error) {
    return res.status(404).json({
      Message: "Something went  wrong ",
      status: false,
    });
  }
};
