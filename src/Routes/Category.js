const express = require("express")
const { createCategory, createSubCategory, getCategoryById, getSubCategoryById, getCategory,getSubCategory, deleteCategory,deleteSubCategory } = require("../Controllers/Category")
const route = express.Router()

route.post("/createCategory",createCategory)
route.get("/getcategorybyid/:id",getCategoryById)
route.post("/createSubCategory",createSubCategory)
route.get("/getSubCategorybyid/:id",getSubCategoryById)
route.delete("/deleteCategory/:id", deleteCategory);
route.delete("/deleteSubCategory/:id", deleteSubCategory);
route.get("/getCategory",getCategory);
route.get("/getSubCategory",getSubCategory);

module.exports = route