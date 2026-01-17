const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/", blogController.getAllBlogPosts);
router.get("/:id", blogController.getBlogPostById);

module.exports = router;
