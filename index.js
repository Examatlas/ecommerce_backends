const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("morgan");
const path = require("path");
dotenv.config({ path: "./.env" });
// const BookRoute = require("./src/Routes/Book")
// const UserRoute = require("./src/Routes/User");
// const WishlistRoute = require("./src/Routes/Wishlist")
// const CartRoute = require("./src/Routes/Cart");
// const BillingRoute = require("./src/Routes/BillingDetail");
// const PaymentRoute = require("./src/Routes/PaymentRoute");
// const BlogRoute = require("./src/Routes/Blog");
// const SubjectRoute = require("./src/Routes/SubjectRoute");
// const CategoryRoute = require("./src/Routes/Category");
// const ExamRoute = require("./src/Routes/Exam");
// const BannerRoute = require("./src/Routes/Banner");
// const ShiprocketRoute = require("./src/Routes/ShiprocketOrder");
// const BulkOrderRoute = require("./src/Routes/BulkOrder");
// const AuthorRoute = require("./src/Routes/Author")

const allRouter = require("./src/Routes/index")

const Razorpay = require("razorpay");

const app = express();
// Increase payload limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("path: ", path.join(__dirname, 'src/uploads'))
app.use(express.static(path.join(__dirname, 'src/uploads')));


// app.use("/api/book",BookRoute);
// app.use("/api/user",UserRoute);
// app.use("/api/wishlist",WishlistRoute);
// app.use("/api/Cart",CartRoute);
// app.use("/api/billing",BillingRoute);
// app.use("/api/payment",PaymentRoute);
// app.use("/api/blog",BlogRoute);
// app.use("/api/subject",SubjectRoute);
// app.use("/api/category",CategoryRoute)
// app.use("/api/exam",ExamRoute);
// app.use("/api/banner",BannerRoute);
// app.use("/api/shiprocket",ShiprocketRoute)
// app.use("/api/bulkorder",BulkOrderRoute);
// app.use("/api/author",AuthorRoute)

app.use("", allRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .send({ message: `Welcome to Ecommerce backend portal (${process.env.NODE_ENV}).`,
  updated_at: "26-11-2024 10:17 PM IST" });
    });

mongoose
  .connect(process.env.DB )
  .then((res) => {
    console.log("mongodb is connected!.");
  })
  .catch((error) => {
    console.log("mongodb error:", error);
  });


const port = process.env.PORT;

app.listen(port, function () {
  console.log(`Server is running on port ${port}.`);
})
