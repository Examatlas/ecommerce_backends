const express = require("express");
const { createBook, getBooks, getBookById, updateBook, deleteBook, deleteImage } = require("../Controllers/Book");

const route = express.Router();
const uploadGFS = require("../Middleware/gridFs_multer");
const upload = require("../Middleware/multer");

route.post("/createBook",upload.array('images',5), createBook);
route.get("/getAllBooks", getBooks);
route.get("/getBookById/:id", getBookById); // Corrected typo here
route.delete("/deleteBook/:id", deleteBook);
route.put("/updateBook/:id",upload.array('images',5), updateBook);
route.delete("/deleteImage/:filename",deleteImage)

module.exports = route;
