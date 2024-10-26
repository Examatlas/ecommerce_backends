const express = require("express")
const { addSubject, deleteSubject, getSubject} = require("../Controllers/Subject")
const route = express.Router()

route.post("/addSubject",addSubject);
route.delete("/deleteSubject/:id", deleteSubject);
route.get("/getSubject",getSubject);

module.exports = route

