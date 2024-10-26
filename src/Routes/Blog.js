const express = require("express")
const { createBlog, getBlogs, getBlogById, deleteBlog, updateBlog } = require("../Controllers/Blog")
// const { authorizeRoles } = require("../Middleware/Auth")
const route = express.Router()

route.post("/createBlog",createBlog);

route.get("/getAllBlogs",getBlogs);

route.get("/getBlogById/:id",getBlogById);

route.delete("/deleteBlog/:id",deleteBlog);

route.put("/updateBlog/:id",updateBlog);

module.exports = route