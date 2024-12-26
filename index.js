const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://nzsadman06:M6wUXAuozcowZxkp@cluster0.h1aou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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

    app.post("/equipments", async (req, res) => {
      const newEquipment = req.body;
      console.log("adding new equipment", newEquipment);
      const result = await equipments.insertOne(newEquipment);
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
