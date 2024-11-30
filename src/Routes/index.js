const Allrouter = require('express').Router();
const BookRoute = require("./Book")
const UserRoute = require("./User");
const WishlistRoute = require("./Wishlist")
const CartRoute = require("./Cart");
const BillingRoute = require("./BillingDetail");
const PaymentRoute = require("./PaymentRoute");
const BlogRoute = require("./Blog");
const SubjectRoute = require("./SubjectRoute");
const CategoryRoute = require("./Category");
const ExamRoute = require("./Exam");
const BannerRoute = require("./Banner");
const ShiprocketRoute = require("./ShiprocketOrder");
const BulkOrderRoute = require("./BulkOrder");
const AuthorRoute = require("./Author")
const {isAuthenticated} = require("../Middleware/Auth");


Allrouter.use("/api/book",BookRoute);
Allrouter.use("/api/user",UserRoute);
Allrouter.use("/api/banner",BannerRoute);
Allrouter.use("/api/category",CategoryRoute);
Allrouter.use("/api/blog", BlogRoute);
Allrouter.use("/api/subject", SubjectRoute);

// Allrouter.use(isAuthenticated);
Allrouter.use("/api/wishlist", isAuthenticated, WishlistRoute);
Allrouter.use("/api/cart", isAuthenticated, CartRoute);
Allrouter.use("/api/payment",isAuthenticated,PaymentRoute);
Allrouter.use("/api/billing", isAuthenticated, BillingRoute);
Allrouter.use("/api/exam", isAuthenticated, ExamRoute);
Allrouter.use("/api/shiprocket", isAuthenticated, ShiprocketRoute);
Allrouter.use("/api/bulkorder", isAuthenticated, BulkOrderRoute);
Allrouter.use("/api/author", isAuthenticated, AuthorRoute);


module.exports = Allrouter;