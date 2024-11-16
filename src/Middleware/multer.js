const multer = require("multer");
const path = require("path");
var fs = require("fs");

var dir = "./src/uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true }); 
}
// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads"); // Specify the folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+ '_'+file.originalname); // Rename the file to include a timestamp
  },
});

function checkFileType(file, cb) {
  // Allowed file extensions
  // console.log(file)
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images types jpeg, jpg, png, gif supported Only! ");
  }
}

// Initialize Multer with the storage engine
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Set file size limit (5MB in this case)
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports=upload;