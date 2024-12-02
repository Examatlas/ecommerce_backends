const BookModel = require("../Models/Book")
const mongoose = require("mongoose");
const { uploadFile } = require("../Utilis/gcp_upload");
const { deleteFile } = require("../Utilis/gcp_upload")
const fs = require("fs")

// create a Book
exports.createBook = async (req, res) => {
  try {
    const { title, keyword, price, sellPrice, author, category, subject, content, tags,  dimension, weight, isbn , stock , page , edition , publication} = req?.body;

    // Validate required fields
    if (!title) return res.status(400).json({ status: false, message: "Titles is required" });
    if (!content) return res.status(400).json({ status: false, message: "Content is required" });
    if (!price) return res.status(400).json({ status: false, message: "Price is required" });
    if (!sellPrice) return res.status(400).json({ status: false, message: "Sell price is required" });
    if (!author) return res.status(400).json({ status: false, message: "Author is required" });
    if (!category) return res.status(400).json({ status: false, message: "Category is required" });
    if (!keyword) return res.status(400).json({ status: false, message: "Keyword is required" });
    if (!subject) return res.status(400).json({ status: false, message: "Subject is required" });
    if (!dimension) return res.status(400).json({ status: false, message: "Dimension is required" });
    if (!stock) return res.status(400).json({ status: false, message: "stock is required" });
    if (!page) return res.status(400).json({ status: false, message: "page is required" });
    if (!edition) return res.status(400).json({ status: false, message: "edition is required" });
    if (!publication) return res.status(400).json({ status: false, message: "publication is required" });

    // Check for duplicate book title
    const check_duplicate = await BookModel.findOne({ title, is_active: true });
    if (check_duplicate) {
      return res.status(400).json({ status: false, message: "Book already exists!" });
    }
    let imageFilenames = [];

    // Handle file uploads if files are present
    if (req.files && req.files.length) {
      imageFilenames = await Promise.all(
        req.files.map(async (file) => {
          try {
            const image_url = await uploadFile(file.path);

            // Delete local file after upload
            fs.unlink(file.path, (err) => {
              if (err) console.error("Error deleting local file:", err);
            });

            return {
              url: image_url,
              filename: file.filename,
              contentType: file.mimetype,
              size: file.size,
              uploadDate: Date.now(),
            };
          } catch (error) {
            console.log("Error uploading file:", error);
            return res.status(500).json({ status: false, error, message: "Error uploading file!" });
          }
        })
      );
    }
    // Now proceed with book creation using collected data
    const newBook = new BookModel({
      title,
      keyword,
      price,
      sellPrice,
      author,
      category,
      content,
      tags,
      edition,
      publication,
      dimension: JSON.parse(dimension),
      weight,
      subject,
      isbn,
      stock,
      page,
      images: imageFilenames,
      IsInCart: false
    });
    console.log(newBook, "new Book is this ")

    await newBook.save();
    return res.status(201).json({
      status: true, message: "Book created successfully",
      data: newBook
    });
  } catch (error) {
    console.log("Error creating book:", error);
    return res.status(500).json({ status: false, message: "Server error", error });
  }
};


// // // Get all books
// exports.getBooks = async (req, res) => {
//   try {
//     const books = await BookModel.find();
//     if (!books) {
//       return res.status(404).json({ status: "false", message: "Book not found" });
//     }
//     return res
//       .status(200)
//       .json({ status: true, message: "Books fetched succcessfully", books, IsInCart: false });
//   } catch (error) {
//     console.log(error.message)
//     return res
//       .status(500)
//       .json({ status: false, error, message: "Internal server error", error });
//   }
// };



// Get all books with search and pagination

exports.getBooks = async (req, res) => {
  try {
    const { search, per_page = 1000, page = 1 } = req?.query;
    // Define the query for finding books
    const query = search
      ? {
          $or: [{ title: { $regex: `${search}`, $options: "i" } }],
        }
      : {};

    // Find books with pagination and return required fields
    const books = await BookModel.find(query, {
        title: true,
        author: true, 
        price: true,
        sellPrice:true,
        images:true,
        category:true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(per_page))
      .limit(parseInt(per_page));

    const totalBooks = await BookModel.countDocuments(query);

    return res.status(200).json({
      status: true,
      data: books,
      message: "Books fetched successfully",
      pagination: {
        totalRows: totalBooks,
        totalPages: Math.ceil(totalBooks / per_page),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: false, error, message: "Internal server error" });
  }
};



// // Get blog by ID
exports.getBookById = async (req, res) => {
  try {
    const id = req?.params?.id;
    const book = await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Book fetched successfully", book, IsInCart: false });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error, message: "Internal server error" });
  }

};


// update book by id 
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, keyword, content, price, sellPrice, tags, author, subject, category, dimension, weight, isbn , stock , page , edition , publication} = req.body;

    // Check if the book exists
    const book = await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({ status: false, message: "Book not found" });
    }

    // Validate required fields
    if (title && title !== book.title) {
      const duplicateCheck = await BookModel.findOne({ title, is_active: true });
      if (duplicateCheck) {
        return res.status(400).json({ status: false, message: "Book with this title already exists!" });
      }
    }
    if (!content) return res.status(400).json({ status: false, message: "Content is required" });
    if (!price) return res.status(400).json({ status: false, message: "Price is required" });
    if (!sellPrice) return res.status(400).json({ status: false, message: "Sell price is required" });
    if (!author) return res.status(400).json({ status: false, message: "Author is required" });
    if (!category) return res.status(400).json({ status: false, message: "Category is required" });
    if (!keyword) return res.status(400).json({ status: false, message: "Keyword is required" });
    if (!subject) return res.status(400).json({ status: false, message: "subject is required" });
    if (!dimension) return res.status(400).json({ status: false, message: "dimension is required" });
    if (!stock) return res.status(400).json({ status: false, message: "stock is required" });
    if (!page) return res.status(400).json({ status: false, message: "page is required" });
    if (!edition) return res.status(400).json({ status: false, message: "edition is required" });
    if (!publication) return res.status(400).json({ status: false, message: "publication is required" });

    let imageFilenames = book.images || [];

    // Handle file uploads if files are present
    if (req.files && req.files.length) {
      const newImages = await Promise.all(
        req.files.map(async (file) => {
          try {
            const image_url = await uploadFile(file.path);

            // Delete local file after upload
            fs.unlink(file.path, (err) => {
              if (err) console.error("Error deleting local file:", err);
            });

            return {
              url: image_url,
              filename: file.filename,
              contentType: file.mimetype,
              size: file.size,
              uploadDate: Date.now(),
            };
          } catch (error) {
            console.log("Error uploading file:", error);
            return res.status(500).json({ status: false, error, message: "Error uploading file!" });
          }
        })
      );

      // Append new images to the existing ones
      imageFilenames = [...imageFilenames, ...newImages];
    }

    // Update fields
    book.title = title || book.title;
    book.keyword = keyword || book.keyword;
    book.price = price || book.price;
    book.sellPrice = sellPrice || book.sellPrice;
    book.author = author || book.author;
    book.category = category || book.category;
    book.content = content || book.content;
    book.subject = subject || book.subject;
    book.stock = stock || book.stock;
    book.page = page || book.page;
    // book.tags = Array.isArray(tags) ? tags : book.tags;
    book.tags = tags
    // book.height = height || book.height;
    book.dimension = dimension ? JSON.parse(dimension) : book.dimension;
    book.weight = weight || book.weight;
    book.isbn = isbn || book.isbn;
    book.edition = edition || book.edition;
    book.publication = publication || book.publication;
    book.images = imageFilenames;

    await book.save();

    return res.status(200).json({ status: true, message: "Book updated successfully", book, IsInCart: false });
  } catch (error) {
    console.log("Error updating book:", error.message);
    return res.status(500).json({ status: false, message: "Internal server error", error });
  }
};


// // Delete book by ID
exports.deleteBook = async (req, res) => {
  try {
    const id = req?.params?.id;
    const book = await BookModel.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Book deleted succcessfully", IsInCart: false });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server error" });
  }
};



// delete image
exports.deleteImage = async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(422).json({ status: false, message: "Filename not found!" });
  }

  try {
    // Step 1: Delete the image from the bucket
    const success = await deleteFile(filename);
    if (!success) {
      return res.status(500).json({ status: false, message: "Failed to delete file from bucket." });
    }

    // Step 2: Remove the image reference from the database (if applicable)
    const book = await BookModel.findOneAndUpdate(
      { 'images.filename': filename },
      { $pull: { images: { filename } } },
      { new: true }
    );

    if (book) {
      return res.status(200).json({ status: true, message: "Image deleted successfully" });
    } else {
      return res.status(404).json({ status: false, message: "Image not found in database" });
    }

  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ status: false, message: "Failed to delete image." });
  }
};


