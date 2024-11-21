const express = require("express")
const { createCategory, createSubCategory, getCategoryById, getSubCategoryById, getCategory,getSubCategory, deleteCategory,deleteSubCategory, getBooksByCategoryName, updateCategory } = require("../Controllers/Category")
const uploadGFS = require("../Middleware/gridFs_multer");
const upload = require("../Middleware/multer");

const route = express.Router()

route.post("/createCategory",upload.array('images',5),createCategory)
route.put("/updateCategory",upload.array('images',5),updateCategory)
route.get("/getcategorybyid/:id",getCategoryById)
route.post("/createSubCategory",createSubCategory)
route.get("/getSubCategorybyid/:id",getSubCategoryById)
route.delete("/deleteCategory/:id", deleteCategory);
route.delete("/deleteSubCategory/:id", deleteSubCategory);
route.get("/getCategory",getCategory);
route.get("/getSubCategory",getSubCategory);
route.get("/getBooksByCategoryName/:category",getBooksByCategoryName)

module.exports = route

