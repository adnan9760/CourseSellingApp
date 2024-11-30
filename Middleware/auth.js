const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Model/User");
//auth

exports.auth = async (req, res, next) => {
  try {
    const authorizationHeader =
      req.cookies.token || req.body.token || req.header("Auth");
    if (!authorizationHeader) {
      return res.json({
        message: "Authorization header or token is missing",
        success: false,
      });
    }
  
    let token = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.split(" ")[1]
      : authorizationHeader;

    token = token.replace(/^"|"$/g, "");

    if (!token) {
      return res.json({
        message: "Token is missing",
        success: false,
      });
    }

    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.json({
        message: "Token is not verified",
        success: false,
      });
    }
  } catch (error) {
    return res.json({
      message: "Something went wrong while verifying the token",
      success: false,
    });
  }

  next();
};

//Isadmin
exports.Isadmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.json({
        message: "This is only for admin ",
        success: false,
      });
    }
  } catch (error) {
    return res.json({
      message: "something error occure",
      success: false,
    });
  }
  next();
};
//Isstudent
exports.Isstudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "student") {
      return res.json({
        message: "This is only for Student ",
        success: false,
      });
    }
  } catch (error) {
    return res.json({
      message: "something error occure",
      success: false,
    });
  }
  next();
};
//Isinstructor
exports.Isinstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "instructor") {
      return res.json({
        message: "This is only for Instructor ",
        success: false,
      });
    }
  } catch (error) {
    return res.json({
      message: "something error occure",
      success: false,
    });
  }
  next();
};
