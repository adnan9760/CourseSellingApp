const Express = require("express");
const router = Express.Router();

const{capturestate,paymentAuth} = require("../controller/Payment");
const{auth, Isinstructor,Isstudent,Isadmin}=require("../Middleware/auth");


router.post("/capturestate",auth,Isstudent,
    capturestate);

router.post("/paymentAuth",
    paymentAuth
);
router.post("/someRoute", (req, res) => {
   
});
module.exports = router;