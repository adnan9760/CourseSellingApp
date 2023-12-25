const razorpay =require("razorpay");

exports.instance= new razorpay({
    key_id:process.env.Key_id,
    key_secret:process.env.key_secret
});