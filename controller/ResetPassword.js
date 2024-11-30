const User = require("../Model/User");
const crypto = require("crypto");
const mailsenser = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.Sendresetpasswordmail = async (req, res) => {
    const { email } = req.body;
    try {
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({
                message: "User not Registered",
                status: false
            });
        }

        const token = crypto.randomUUID();
        const resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

        await User.findOneAndUpdate(
            { email: email },
            { resetPasswordToken: token, resetPasswordExpire },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;

        await mailsenser(email, "Password Reset Link", `Password Reset Link: ${url}`);

        return res.status(200).json({
            message: "Email Sent Successfully",
            status: true
        });
    } catch (error) {
        console.error("Error in Sendresetpasswordmail:", error);
        return res.status(500).json({
            message: "Something went wrong",
            status: false
        });
    }
};


exports.resetpassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match",
            status: false
        });
    }

    try {
        const userDetail = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!userDetail) {
            return res.status(400).json({
                message: "Invalid or expired token",
                status: false
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        userDetail.password = hashedPassword;
        userDetail.resetPasswordToken = undefined; // Clear the token
        userDetail.resetPasswordExpire = undefined; // Clear the expiration

        await userDetail.save();

        return res.status(200).json({
            message: "Password Reset Successfully",
            status: true
        });
    } catch (error) {
        console.error("Error in resetpassword:", error);
        return res.status(500).json({
            message: "Something went wrong",
            status: false
        });
    }
};

