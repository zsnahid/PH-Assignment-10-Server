const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/cors");
const { connectDB } = require("./config/database");

// Import controllers to set database
const equipmentController = require("./controllers/equipmentController");
const categoryController = require("./controllers/categoryController");
const reviewController = require("./controllers/reviewController");
const blogController = require("./controllers/blogController");

// Import routes
const equipmentRoutes = require("./routes/equipmentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Create Express app
const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database and set it in controllers
let dbInitialized = false;

const initializeDatabase = async () => {
  if (!dbInitialized) {
    try {
      const db = await connectDB();

      // Set database in all controllers
      equipmentController.setDatabase(db);
      categoryController.setDatabase(db);
      reviewController.setDatabase(db);
      blogController.setDatabase(db);

      dbInitialized = true;
      console.log("Database initialized in controllers");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
};

// Initialize database when app starts
initializeDatabase().catch(console.error);

// Root route
app.get("/", (req, res) => {
  res.send("EquiSport Server");
});

// API Routes
app.use("/equipments", equipmentRoutes);
app.use("/categories", categoryRoutes);
app.use("/reviews", reviewRoutes);
app.use("/blog-posts", blogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
