const BlogModel = require("../Models/Blog");
const mongoose = require("mongoose");
const {uploadFile} = require("../Utilis/gcp_upload")
const fs = require("fs")
const {deleteFile} = require("../Utilis/gcp_upload")

// Create a Blog with image upload
const createBlog = async (req, res) => {
  try {
    const { title, keyword, content, tags } = req?.body;

    // Validate required fields
    if (!title || !content || !keyword) {
      return res
        .status(400)
        .json({ message: "Title, content, and keyword are required" });
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

    // Create new blog post with the collected data and uploaded images
    const BlogPost = new BlogModel({
      title,
      keyword,
      content,
      tags,
      images: imageFilenames, // Save image information here
    });
    await BlogPost.save();

    return res
      .status(200)
      .json({ status: true, message: "Blog created successfully", data: BlogPost });
  } catch (error) {
    console.log(error.message, "error");
    return res
      .status(500)
      .json({ status: false, error, message: "Internal server error!" });
  }
};



// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const { search, is_active = true, per_page = 10, page = 1 } = req?.query;

    // Define the query for finding blogs
    const query = search
      ? {
          $or: [{ title: { $regex: `${search}`, $options: "i" } }],
          is_active: is_active,
        }
      : {
          is_active: is_active,
        };

    // Find blogs with pagination and return required fields
    const blogs = await BlogModel.find(query, {
        title: true,
        is_active: true,
        content: true,
        tags: true,
        keyword: true,
        images: true, // Include images
        createdAt: true,
        updatedAt: true,
        // Add any other fields you want to retrieve
      })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(per_page))
      .limit(parseInt(per_page));

    const totalBlogs = await BlogModel.countDocuments(query);

    return res.status(200).json({
      status: true,
      data: blogs,
      message: "Blogs fetched successfully",
      pagination: {
        totalRows: totalBlogs,
        totalPages: Math.ceil(totalBlogs / per_page),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error, message: "Internal server error" });
  }
};



// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const id = req?.params?.id;
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res
      .status(200)
      .json({ status: true, blog, message: "Blog fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error, message: "Internal server error" });
  }
};


// Update blog by id with image upload
const updateBlog = async (req, res) => {
  try {
    const { id } = req?.params;
    const { title, keyword, content, tags } = req.body;
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update fields
    blog.title = title || blog.title;
    blog.keyword = keyword || blog.keyword;
    blog.content = content || blog.content;
    // blog.tags = Array.isArray(tags) ? tags : blog.tags;
    blog.tags = tags;

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

    // Append new images to existing ones
    if (imageFilenames.length) {
      blog.images = blog.images.concat(imageFilenames); // Combine old and new images
    }

    await blog.save(); // Save the updated blog

    return res
      .status(200)
      .json({ status: true, message: "Blog updated successfully", data: blog });
  } catch (error) {
    console.log("error", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};




// Delete blog by ID
const deleteBlog = async (req, res) => {
  try {
    const id = req?.params?.id;
    const blog = await BlogModel.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Blog deleted succcessfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server error" });
  }
};


// delete image
const deleteImage = async (req, res) => {
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
    const book = await BlogModel.findOneAndUpdate(
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




module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteImage
};
