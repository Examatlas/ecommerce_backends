const express = require("express")
const { getAllUser, getUserById, forgotPassword, resetPassword, createUser, login, adminLogin} = require("../Controllers/User")
const route = express.Router()

route.get("/getUser",getAllUser)
route.get("/getUserById/:id",getUserById)
// route.get("/getUserById/:id",isAuthenticated,getUserById)
route.post("/forgotpassword",forgotPassword)
route.post("/resetpassword",resetPassword)

route.post("/createUser",createUser)
route.post("/loginUser",login)
route.post("/adminLogin",adminLogin)

module.exports = route
