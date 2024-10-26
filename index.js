const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("morgan");
// const path = require("path");
dotenv.config({ path: "./.env" });
const BookRoute = require("./src/Routes/Book")
const UserRoute = require("./src/Routes/User");
const WishlistRoute = require("./src/Routes/Wishlist")
const CartRoute = require("./src/Routes/Cart");
const BillingRoute = require("./src/Routes/BillingDetail");
const PaymentRoute = require("./src/Routes/PaymentRoute");
const BlogRoute = require("./src/Routes/Blog");
const SubjectRoute = require("./src/Routes/SubjectRoute");
const CategoryRoute = require("./src/Routes/Category")
// const allRouter = require("./src/Routes/index")
const Razorpay = require("razorpay");

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// console.log("path: ", path.join(__dirname, 'src/uploads'))
// app.use(express.static(path.join(__dirname, 'src/uploads')));

app.use("/api/book",BookRoute);
app.use("/api/user",UserRoute);
app.use("/api/wishlist",WishlistRoute);
app.use("/api/Cart",CartRoute);
app.use("/api/billing",BillingRoute);
app.use("/api/payment",PaymentRoute);
app.use("/api/blog",BlogRoute);
app.use("/api/subject",SubjectRoute);
app.use("/api/category",CategoryRoute)

// app.use("/api/", allRouter);
app.get("/", (req, res) => {
  res
    .status(200)
    .send({ message: "Welcome to Ecommerce backend portal.",
  updated_at: "25-10-2024 17:34 PM IST" });
    });


mongoose
  .connect(process.env.DB)
  .then((res) => {
    console.log("mongodb is connected!.");
  })
  .catch((error) => {
    console.log("mongodb error:", error);
  });

  
  // app.get('/paymentsuccess', (req, res) => {
  //   const reference = req.query.reference;
  //   res.send(`Payment successful..! Reference ID: ${reference}`);
  // });


const port = process.env.PORT;

app.listen(port, function () {
  console.log(`Server is running on port ${port}.`);
});