const BookModel = require("../Models/Book")

//create a Book
exports.createBook = async (req, res) => {
  try {

    const {
      title, keyword, price, sellPrice, 
      author, category, content, tags
    } = req.body;

    // Create a new Book instance
    const book = new BookModel({
      title,
      keyword,
      price,
      sellPrice,
      author,
      category,
      content,
      tags,
    });


    const savedBook = await book.save();
    res.status(201).json({ status: true, message: "Book created successfully",data: savedBook });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};



// // Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await BookModel.find().sort({ createdAt: -1 });
    if(!books){
      return res.status(404).json({status:"false",message:"Book not found"});
    }
    return res
      .status(200)
      .json({ status: true, message: "Books fetched succcessfully",books });
  } catch (error) {
    console.log(error.message)
    return res
      .status(500)
      .json({ status: false, error, message: "Internal server error",error });
  }
};



// // Get blog by ID
exports.getBookById = async(req, res) => {
  try {
    const id =req?.params?.id;
    const book =await BookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res
      .status(200)
      .json({ status: true,  message: "Book fetched successfully" , book });
  } catch (error) {
    return res
    .status(500)
    .json({ status: false, error, message: "Internal server error" });
  }

};




// // update book  by id
exports.updateBook = async (req, res) => {
  try {
    const {id}=req?.params;
    const { title, keyword, content,price,sellPrice,tags , author , category } = req.body;
    const book = await BookModel.findById(id);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update fields
    book.title = title || book.title;
    book.keyword = keyword || book.keyword;
    book.price = price || book.price;
    book.sellPrice = sellPrice || book.sellPrice;
    // book.shippingCharge = shippingCharge || book.shippingCharge;
    book.author = author || book.author;
    book.category = category|| book.category;
    book.content = content || book.content;
    book.tags = Array.isArray(tags) ? tags : book.tags;

    await book.save(); // Save the updated blog

    return res
      .status(200)
      .json({ status: true, message: "Book updated successfully",book });
  } catch (error) {
    console.log("error", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};


// // Delete blog by ID
exports.deleteBook = async(req, res) => {
  try {
   const id=req?.params?.id;
   const book =await BookModel.findByIdAndDelete(id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res
  .status(200)
  .json({ status: true, message: "Book deleted succcessfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server error" });
  }
};



