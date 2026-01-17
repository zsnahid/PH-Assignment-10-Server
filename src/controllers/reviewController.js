// Get database instance (will be set when app starts)
let db;

const setDatabase = (database) => {
  db = database;
};

const getReviews = async (req, res) => {
  try {
    const reviews = db.collection("reviews");
    const result = await reviews
      .aggregate([
        {
          $unwind: "$reviews",
        },
        {
          $project: {
            product: 1,
            brand: 1,
            review: "$reviews",
          },
        },
        {
          $sort: { "review.date": -1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();

    res.json(result);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  setDatabase,
  getReviews,
};
