const Express = require("express");
const router = Express.Router();
const db = require("./config/database");
const cloud = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const userroutes = require("./Routes/User");
const Paymentroutes = require("./Routes/Paymentroute");
const Profileroutes = require("./Routes/Profile");
const Courseroutes = require("./Routes/Course");
const cookiesparser = require("cookie-parser");
const cors = require("cors");

const app = Express();

require("dotenv").config();

const PORT = process.env.PORT;
app.use(Express.json());
app.use(cookiesparser());
app.use(
  cors({
    origin: "https://coursesellingapp-udoa.onrender.com",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

db.connect();

cloud.cloudinaryconnect();

app.use("/api/v1/auth", userroutes);
app.use("/api/v1/payment", Paymentroutes);
app.use("/api/v1/course", Courseroutes);
app.use("/api/v1/Profile", Profileroutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your Server Runnung ",
  });
});

app.listen(4000, () => {
  console.log(`App is listening at ${PORT}`);
});
