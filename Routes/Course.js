const Express = require("express");
const router = Express.Router();

const{Createcourse,Updatecourseaspublic,getCourseAlldetails,FetchEnrolledCourse,getCourseDetail} = require("../controller/Courses");
const{createReview,GetAvgReviews,getAllReview,fetchAllReview} = require("../controller/Rating&Review");
const{CreateTag,getAlldetail,getAlltag} = require("../controller/Tags");
const{createSection,updateCourse,deleteSection,fetchSection}= require("../controller/Section");
const{createSubsection,updateSubsection,deletesubSection,getSubsection}= require("../controller/Subsection");
const{auth, Isinstructor,Isstudent,Isadmin}=require("../Middleware/auth");


router.post("/Createcourse",auth,Createcourse);
router.get("/fetchenrollcourse",auth,FetchEnrolledCourse);

router.get("/getCourseAlldetails",getCourseAlldetails);

router.get("/getCourseDetail",getCourseDetail);
router.put("/markaspublic",Updatecourseaspublic)

router.post("/createReview",auth,Isstudent,createReview);
router.get("/fetchAllReview",auth,Isstudent,fetchAllReview)

router.get("/GetAvgRating",GetAvgReviews);

router.post("/getAllRating",getAllReview);

// router.post("/CreateTag",auth,Isadmin,CreateTag);
router.post("/CreateTag",CreateTag);

router.get("/getAlldeatil",getAlldetail);

router.post("/getAllTag",getAlltag);

router.post("/createSection",auth,Isinstructor,createSection);

router.put("/updateCourse",auth,Isinstructor,updateCourse);
router.get("/fetchsection",auth,Isinstructor,fetchSection);


router.delete("/deleteSection",auth,Isinstructor,deleteSection);

router.post("/createSubsection",auth,Isinstructor,createSubsection);
router.get("/fetchSubsection",auth,Isinstructor,getSubsection);


router.post("/updateSubsection",auth,Isinstructor,updateSubsection);

router.post("/deletesubsection",auth,Isstudent,deletesubSection);


module.exports=router;


