const Express = require("express");
const router = Express.Router();

const{additionaldetail,deleteAccount} = require("../controller/Profile");
const{auth, Isinstructor,Isstudent,Isadmin}=require("../Middleware/auth");

router.put("/additionaldetail",auth,additionaldetail);

router.delete("/deleteAccount",deleteAccount);



module.exports=router;