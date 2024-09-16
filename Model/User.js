const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    trim: true,
  },

  lastName: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirmpassword: {
    type: String,
    require: true,
  },
  contactNumber: {
    type: Number,
    require: false,
  },
  image: {
    type: String,
    require: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "student", "instructor"],
    require: true,
  },
  token: {
    type: String,
    require: false,
  },
  resetPasswordExpire: {
    type: Date,
    require: false,
  },
  additionalDetail: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Profile",
  },

  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  coursesProgress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
