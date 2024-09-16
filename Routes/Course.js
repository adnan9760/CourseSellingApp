const Express = require("express");
const router = Express.Router();

const{Createcourse,getCourseAlldetails,getCourseDetail} = require("../controller/Courses");
const{createReview,GetAvgReviews,getAllReview} = require("../controller/Rating&Review");
const{CreateTag,getAlldetail,getAlltag} = require("../controller/Tags");
const{createSection,updateCourse,deleteSection}= require("../controller/Section");
const{createSubsection,updateSubsection,deletesubSection}= require("../controller/Subsection");
const{auth, Isinstructor,Isstudent,Isadmin}=require("../Middleware/auth");

router.post("/Createcourse",auth,Createcourse);

router.post("/getCourseAlldetails",getCourseAlldetails);

router.post("/getCourseDetail",getCourseDetail);

router.post("/createReview",auth,Isstudent,createReview);

router.post("/GetAvgRating",GetAvgReviews);

router.post("/getAllRating",getAllReview);

// router.post("/CreateTag",auth,Isadmin,CreateTag);
router.post("/CreateTag",CreateTag);

router.get("/getAlldeatil",getAlldetail);

router.post("/getAllTag",getAlltag);

router.post("/createSection",auth,Isinstructor,createSection);

router.put("/updateCourse",auth,Isinstructor,updateCourse);

router.delete("/deleteSection",auth,Isinstructor,deleteSection);

router.post("/createSubsection",auth,Isinstructor,createSubsection);

router.post("/updateSubsection",auth,Isinstructor,updateSubsection);

router.post("/deletesubsection",auth,Isstudent,deletesubSection);


module.exports=router;


