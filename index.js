require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 3000;

// CORS configuration
app.use(
  cors({
    origin: true, // This will copy the Origin header from the request
    credentials: false, // Setting this to false since we're not using credentials
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h1aou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("assignment10db");
    const equipments = database.collection("equipments");
    const users = database.collection("users");
    const reviews = database.collection("reviews");
    const blogPosts = database.collection("blogPosts");

    app.get("/equipments", async (req, res) => {
      const cursor = equipments.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/equipments/filter", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const cursor = equipments.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/equipments-for-home", async (req, res) => {
      const cursor = equipments.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/equipments-sorted", async (req, res) => {
      const cursor = equipments.find().sort({ rating: -1, price: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get all categories with their details
    app.get("/categories", async (req, res) => {
      try {
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
    });

    // Get products by category
    app.get("/equipments/category/:category", async (req, res) => {
      try {
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
    });

    // Search endpoint for equipments - must be before :id route
    app.get("/equipments/search", async (req, res) => {
      try {
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
    });

    // Get all equipment with discounted prices - must be before :id route
    app.get("/equipments/discounted", async (req, res) => {
      try {
        const query = { price: { $lt: "$originalPrice" } };

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
    });

    // Get equipment by ID - must be after search route
    app.get("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipments.findOne(query);
      res.send(result);
    });

    app.post("/equipments", async (req, res) => {
      const newEquipment = req.body;
      const result = await equipments.insertOne(newEquipment);
      res.send(result);
    });

    app.put("/equipments/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: req.body,
      };

      const result = await equipments.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.delete("/equipments/:id", async (req, res) => {
      id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await equipments.deleteOne(query);
      res.send(result);
    });

    // Get all reviews for carousel
    app.get("/reviews", async (req, res) => {
      try {
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
    });

    // Get all blog posts
    app.get("/blog-posts", async (req, res) => {
      try {
        const result = await blogPosts
          .find()
          .sort({ publishDate: -1 })
          .toArray();
        res.json(result);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    });

    // Get single blog post by ID
    app.get("/blog-posts/:id", async (req, res) => {
      try {
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
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("EquiSport Server");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
