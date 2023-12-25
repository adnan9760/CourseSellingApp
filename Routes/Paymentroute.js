const Express = require("express");
const router = Express.Router();

const{capturestate,paymentAuth} = require("../controller/Payment");

router.post("/capturestate",auth,Isstudent,capturestate);

router.post("/paymentAuth",paymentAuth);