const BlogModel = require("../Models/Blog");

//create a Blog
const createBlog = async (req, res) => {
  try {
    const { title, keyword, content, tags } = req?.body;

    if (!title || !content || !keyword) {
      return res
        .status(400)
        .json({ message: "Title, content and keyword are required" });
    }

    const BlogPost = new BlogModel({
      title,
      keyword,
      content,
      tags,
    });
    await BlogPost.save();
    return res
      .status(200)
      .json({ status: true, message: "Blog created succcessfully" });
  } catch (error) {
    console.log(error.message, "error");
    return res
      .status(500)
      .json({ status: false, error, message: "internal server error!" });
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const { search, is_active = true, per_page = 10, page = 1 } = req?.query;
    // find blog based on pagination and Serach
    const blogs = await BlogModel.find(
      search
        ? {
            $or: [{ title: { $regex: `${search}`, $options: "i" } }],
            is_active: is_active,
          }
        : {
            is_active: is_active,
          },
      { title: true, is_active: true, content:true,tags:true,keyword:true }
    )
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(per_page))
      .limit(parseInt(per_page));

    const totalBlogs = await BlogModel?.countDocuments(
      search
        ? {
            $or: [{ title: { $regex: `${search}`, $options: "i" } }],
            is_active: is_active,
          }
        : {
            is_active: is_active,
          }
    );

    // if (!blogs) {
    //   return res
    //     .status(404)
    //     .json({ status: "false", message: "Blog not found" });
    // }
    return res.status(200).json({
      status: true,
      data:blogs,
      message: "Blogs fetched succcessfully",
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

// update blog by id
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
    blog.tags = Array.isArray(tags) ? tags : blog.tags;

    await blog.save(); // Save the updated blog

    return res
      .status(200)
      .json({ status: true, message: "Blog updated successfully" });
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

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
