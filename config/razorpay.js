const razorpay =require("razorpay");
require("dotenv").config();
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET);
exports.instance= new razorpay({
    key_id:"rzp_test_WsUKvsDYu1mbwO",
    key_secret:"tboTCiD5APBUosx1MZg8EKBT"
    
});