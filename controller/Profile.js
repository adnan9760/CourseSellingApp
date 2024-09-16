const User = require("../Model/User");
const Profile = require("../Model/Profile");
exports.additionaldetail = async (req, res) => {
  try {
    const dob = "";
    const gender = req.body;
    const phone = req.body;
    const about = "";
    const userid = req.user.id;

    if (!gender || !phone) {
      return res.json({
        messsage: "Please Fill All Field",
        status: false,
      });
    }
    const userfind = await User.findById(id);
    const Profileid = await userfind.additionalDetail;
    const Profiledetail = await Profile.findById(Profileid);

    Profiledetail.dateofbirth = dob;
    Profiledetail.gender = gender;
    Profiledetail.PhoneNumber = phone;
    Profiledetail.about = about;
    await Profiledetail.save();

    return res.json({
      messsage: "Profile Updated Succesfully",
      status: true,
    });
  } catch (error) {
    return res.json({
      messsage: "Something went Wrong",
      status: false,
    });
  }
};
exports.deleteAccount = async (req, res) => {
  console.log("Account Section");
  try {
    const { userid } = req.body.userid;
    const finduser = await User.findById(userid);
    if (!finduser) {
      return res.json({
        message: "User not found",
        status: false,
      });
    }

    // Get the additional detail ID
    const additionalid = finduser.additionalDetail;

    // Delete the associated profile and user
    await Profile.findByIdAndDelete(additionalid);
    await User.findByIdAndDelete(userid);

    return res.json({
      message: "Account Successfully Deleted",
      status: true,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.json({
      message: "Something Went Wrong",
      status: false,
    });
  }
};

//Remaining
exports.updateDisplayImage = async (req, res) => {
  try {
    const Image = req.file.Files;
  } catch (error) {
    return res.json({
      messsage: "Something Went Wrong",
      status: false,
    });
  }
};
