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
      const cursor = equipments.find().sort({ price: 1 });
      const result = await cursor.toArray();
      res.send(result);
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
