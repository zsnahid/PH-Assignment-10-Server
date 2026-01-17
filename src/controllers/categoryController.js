// Get database instance (will be set when app starts)
let db;

const setDatabase = (database) => {
  db = database;
};

const getCategories = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const categories = await equipments
      .aggregate([
        {
          $group: {
            _id: "$category",
            name: { $first: "$category" },
            image: { $first: "$image" },
            productCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            productCount: 1,
          },
        },
      ])
      .toArray();

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  setDatabase,
  getCategories,
};
