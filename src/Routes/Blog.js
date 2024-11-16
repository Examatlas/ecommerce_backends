const express = require("express")
const { createBlog, getBlogs, getBlogById, deleteBlog, updateBlog , deleteImage} = require("../Controllers/Blog")
// const { authorizeRoles } = require("../Middleware/Auth")
const route = express.Router()
const uploadGFS = require("../Middleware/gridFs_multer");
const upload = require("../Middleware/multer");


route.post("/createBlog",upload.array('images',5),createBlog);

route.get("/getAllBlogs",getBlogs);

route.get("/getBlogById/:id",getBlogById);

route.delete("/deleteBlog/:id",deleteBlog);

route.put("/updateBlog/:id",upload.array('images',5),updateBlog);

route.delete("/deleteImage/:filename",deleteImage)

module.exports = route