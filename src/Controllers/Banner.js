// controllers/bannerController.js
const Banner = require("../Models/Banner");
const SecondBanner = require("../Models/SecondBanner");
const ThirdBanner = require("../Models/ThirdBanner")

const fs = require("fs");
const uploadFile = require("../Utilis/gcp_upload")

// Allowed file types and size limit
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // Max file size 10MB

exports.createBanner = async (req, res) => {
  try {
    // Validate file uploads
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: false, message: "No files uploaded!" });
    }

    if (req.files.length > 5) {
      return res.status(400).json({ status: false, message: "You can upload a maximum of 5 images only!" });
    }

    // Validate file types and sizes
    const imageFilenames = await Promise.all(
      req.files.map(async (file) => {
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          return res.status(400).json({ status: false, message: "Invalid file type. Only JPG and PNG are allowed." });
        }
        if (file.size > MAX_FILE_SIZE) {
          return res.status(400).json({ status: false, message: "File size exceeds the limit of 10MB." });
        }

        try {
          const image_url = await uploadFile(file.path); // Assuming uploadFile handles uploading to cloud storage

          // Delete the local file after upload
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
          return res.status(500).json({ status: false, message: "Error uploading file!" });
        }
      })
    );

    // Create the new banner entry with the uploaded images
    const newBanner = new Banner({
      images: imageFilenames, // Store image information
    });

    await newBanner.save();
    return res.status(201).json({ status: true, message: "Banner created successfully!", data: newBanner });
  } catch (error) {
    console.log("Error creating banner:", error);
    return res.status(500).json({ status: false, message: "Server error", error });
  }
};



// Get Banner
exports.getBanner = async (req, res) => {
  try {
    // Retrieve all banners from the database
    const banners = await Banner.findOne().sort({ createdAt: -1 });
    
    if (!banners || banners.length === 0) {
      return res.status(404).json({ status: false, message: "No banners found." });
    }

    return res.status(200).json({ status: true, message: "Banners retrieved successfully", data: banners });
  } catch (error) {
    console.log("Error retrieving banners:", error);
    return res.status(500).json({ status: false, message: "Server error", error });
  }
};


// for upload only 1 image
exports.createSecondBanner = async (req, res) => {
  try {
    // Validate file upload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: false, message: "No file uploaded!" });
    }

    if (req.files.length > 1) {
      return res.status(400).json({ status: false, message: "You can only upload one image!" });
    }

    const file = req.files[0];

    // Validate file type and size
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ status: false, message: "Invalid file type. Only JPG and PNG are allowed." });
    }
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ status: false, message: "File size exceeds the limit of 10MB." });
    }

    // Upload the file to cloud storage
    try {
      const image_url = await uploadFile(file.path); // Assuming uploadFile handles uploading to cloud storage

      // Delete the local file after upload
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });

      // Create the new banner entry with the uploaded image
      const newBanner = new SecondBanner({
        images: [{ url: image_url, filename: file.filename, contentType: file.mimetype, size: file.size, uploadDate: Date.now() }],
      });

      await newBanner.save();
      return res.status(201).json({ status: true, message: "Banner created successfully!", data: newBanner });
    } catch (error) {
      console.log("Error uploading file:", error);
      return res.status(500).json({ status: false, message: "Error uploading file!" });
    }
  } catch (error) {
    console.log("Error creating banner:", error);
    return res.status(500).json({ status: false, message: "Server error", error });
  }
};


// for get only 1 image
exports.getSecondBanner = async (req, res) => {
  try {
    // Fetch the most recent banner
    const banner = await SecondBanner.findOne().sort({ createdAt: -1 }).exec();

    if (!banner) {
      return res.status(404).json({ status: false, message: "No banner found!" });
    }

    return res.status(200).json({ status: true, message: "Banner retrieved successfully!", data: banner });
  } catch (error) {
    console.log("Error retrieving banner:", error);
    return res.status(500).json({ status: false, message: "Server error", error });
  }
};




// for upload only 1 image
exports.createThirdBanner = async (req, res) => {
  try {
    // Validate file upload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: false, message: "No file uploaded!" });
    }

    if (req.files.length > 1) {
      return res.status(400).json({ status: false, message: "You can only upload one image!" });
    }

    const file = req.files[0];

    // Validate file type and size
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ status: false, message: "Invalid file type. Only JPG and PNG are allowed." });
    }
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ status: false, message: "File size exceeds the limit of 10MB." });
    }

    // Upload the file to cloud storage
    try {
      const image_url = await uploadFile(file.path); // Assuming uploadFile handles uploading to cloud storage

      // Delete the local file after upload
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });

      // Create the new banner entry with the uploaded image
      const newBanners = new ThirdBanner({
        images: [{ url: image_url, filename: file.filename, contentType: file.mimetype, size: file.size, uploadDate: Date.now() }],
      });

      await newBanners.save();
      return res.status(201).json({ status: true, message: "Banner created successfully!", data: newBanners });
    } catch (error) {
      console.log("Error uploading file:", error);
      return res.status(500).json({ status: false, message: "Error uploading file!" });
    }
  } catch (error) {
    console.log("Error creating banner:", error);
    return res.status(500).json({ status: false, message: "Server error", error });
  }
};


// for get only 1 image
exports.getThirdBanner = async (req, res) => {
  try {
    // Fetch the most recent banner
    const banners = await ThirdBanner.findOne().sort({ createdAt: -1 }).exec();

    if (!banners) {
      return res.status(404).json({ status: false, message: "No banner found!" });
    }

    return res.status(200).json({ status: true, message: "Banner retrieved successfully!", data: banners });
  } catch (error) {
    console.log("Error retrieving banner:", error);
    return res.status(500).json({ status: false, message: "Server error", error });
  }
};
