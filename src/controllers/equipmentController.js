const { ObjectId } = require("mongodb");

// Get database instance (will be set when app starts)
let db;

const setDatabase = (database) => {
  db = database;
};

const getEquipments = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const cursor = equipments.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching equipments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEquipmentsByFilter = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const email = req.query.email;
    const query = { userEmail: email };
    const cursor = equipments.find(query);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error filtering equipments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEquipmentsForHome = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const cursor = equipments.find().limit(6);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching equipments for home:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEquipmentsSorted = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const cursor = equipments.find().sort({ rating: -1, price: -1 });
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching sorted equipments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEquipmentsByCategory = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const category = req.params.category;
    const query = { category: { $regex: new RegExp(category, "i") } };
    const result = await equipments.find(query).toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const searchEquipments = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchQuery = {
      $or: [
        { item: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };

    const cursor = equipments.find(searchQuery).limit(10);
    const results = await cursor.toArray();

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getDiscountedEquipments = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    // Using $expr to compare fields within the same document
    const discountedItems = await equipments
      .find({
        $expr: { $lt: ["$price", "$originalPrice"] },
      })
      .toArray();

    res.json({
      success: true,
      count: discountedItems.length,
      data: discountedItems,
    });
  } catch (error) {
    console.error("Error fetching discounted equipment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getEquipmentById = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await equipments.findOne(query);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.send(result);
  } catch (error) {
    console.error("Error fetching equipment by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createEquipment = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const newEquipment = req.body;
    const result = await equipments.insertOne(newEquipment);
    res.send(result);
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: req.body,
    };

    const result = await equipments.updateOne(filter, updatedDoc, options);
    res.send(result);
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const equipments = db.collection("equipments");
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await equipments.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  setDatabase,
  getEquipments,
  getEquipmentsByFilter,
  getEquipmentsForHome,
  getEquipmentsSorted,
  getEquipmentsByCategory,
  searchEquipments,
  getDiscountedEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
