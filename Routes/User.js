const Express = require("express");
const router = Express.Router();

const{auth, Isinstructor,Isstudent,Isadmin}=require("../Middleware/auth");
const{sendOTP,Signup,Login,changePassword} = require("../controller/Auth");
const{Sendresetpasswordmail} = require("../controller/ResetPassword")



router.post("/Login",Login);

router.post("/Signup",Signup);

router.post("/SendOTP",sendOTP);

router.post("/changePassword",changePassword);
router.post("/forget-password",Sendresetpasswordmail);

module.exports = router;

