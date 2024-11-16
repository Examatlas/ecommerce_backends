const express = require("express");
const route = express.Router();
const uploadGFS = require("../Middleware/gridFs_multer");
const upload = require("../Middleware/multer");
const { createBanner, getBanner, createSecondBanner, getSecondBanner, createThirdBanner, getThirdBanner } = require("../Controllers/Banner");


route.post("/create-banner", upload.array('files',5), createBanner);
route.get("/get-banner", getBanner);


route.post("/createSecondBanner",upload.array('file',1),createSecondBanner)
route.get("/getSecondBanner",getSecondBanner);

route.post("/createThirdBanner",upload.array('file',1),createThirdBanner)
route.get("/getThirdBanner",getThirdBanner);

module.exports = route;
