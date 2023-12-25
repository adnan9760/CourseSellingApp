const Express = require("express");
const router = Express.Router();

const{Createcourse,getAlldetail,getCourseDetail} = require("../controller/Courses");
const{createReview,GetAvgReviews,getAllReview} = require("../controller/Rating&Review");
const{CreateTag,getAlldetail,getAlltag} = require("../controller/Tags");
const{createSection,updateCourse,deleteSection}= require("../controller/Section");
const{createSubsection,updateSubsection,deletesubsection}= require("../controller/Subsection");
const{auth, Isinstructor,Isstudent,Isadmin}=require("../Middleware/auth");

router.post("/Createcourse",auth,Isinstructor,Createcourse);

router.post("/getAlldetail",getAlldetail);

router.post("/getCourseDetail",getCourseDetail);

router.post("/createReview",auth,Isstudent,createReview);

router.post("/GetAvgRating",GetAvgReviews);

router.post("/getAllRating",getAllReview);

router.post("/CreateTag",auth,Isadmin,CreateTag);

router.post("/getAlldeatil",getAlldetail);

router.post("/getAllTag",getAlltag);

router.post("/createSection",auth,Isinstructor,createSection);

router.post("/updateCourse",auth,Isinstructor,updateCourse);

router.post("/deleteSection",auth,Isinstructor,deleteSection);

router.post("/createSubsection",auth,Isinstructor,createSubsection);

router.post("/updateSubsection",auth,Isinstructor,updateSubsection);

router.post("/deletesubsection",auth,Isstudent,deletesubsection);





