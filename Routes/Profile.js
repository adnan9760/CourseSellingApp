const Express = require("express");
const router = Express.Router();

const{additionaldetail,deleteAccount,fetchuserdetail} = require("../controller/Profile");
const{auth, Isinstructor,Isstudent,Isadmin}=require("../Middleware/auth");

router.put("/additionaldetail",auth,additionaldetail);
router.get("/fetchuserdata",fetchuserdetail);
router.delete("/deleteAccount",deleteAccount);




module.exports=router;