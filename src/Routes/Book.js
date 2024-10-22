const express = require("express");
const { createBook, getBooks, getBookById, updateBook, deleteBook } = require("../Controllers/Book");

const route = express.Router();

route.post("/createBook", createBook);
route.get("/getAllBooks", getBooks);
route.get("/getBookById/:id", getBookById); // Corrected typo here
route.delete("/deleteBook/:id", deleteBook);
route.put("/updateBook/:id", updateBook);

module.exports = route;
