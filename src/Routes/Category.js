const express = require("express")
const { createCategory, createSubCategory, getCategoryById, getSubCategoryById, getCategory,getSubCategory, deleteCategory,deleteSubCategory, getBooksByCategoryName, updateCategory } = require("../Controllers/Category")

const route = express.Router()

route.post("/createCategory",createCategory)
route.put("/updateCategory",updateCategory)
route.get("/getcategorybyid/:id",getCategoryById)
route.post("/createSubCategory",createSubCategory)
route.get("/getSubCategorybyid/:id",getSubCategoryById)
route.delete("/deleteCategory/:id", deleteCategory);
route.delete("/deleteSubCategory/:id", deleteSubCategory);
route.get("/getCategory",getCategory);
route.get("/getSubCategory",getSubCategory);
route.get("/getBooksByCategoryName/:category",getBooksByCategoryName)

module.exports = route

