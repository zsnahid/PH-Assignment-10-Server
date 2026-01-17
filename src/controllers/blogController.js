const { ObjectId } = require("mongodb");

// Get database instance (will be set when app starts)
let db;

const setDatabase = (database) => {
  db = database;
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = db.collection("blogPosts");
    const result = await blogPosts.find().sort({ publishDate: -1 }).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getBlogPostById = async (req, res) => {
  try {
    const blogPosts = db.collection("blogPosts");
    const id = req.params.id;
    const result = await blogPosts.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  setDatabase,
  getAllBlogPosts,
  getBlogPostById,
};
