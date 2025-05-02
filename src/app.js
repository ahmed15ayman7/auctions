const express = require("express");
require('dotenv').config(); // Ensure this is at the top of your file to load the .env variables
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const landRoutes = require("./routes/landRoutes.js");
const auctionRoutes = require("./routes/auctionRoutes.js");
const basinRoutes = require("./routes/basinRoutes.js");
const bidRoutes = require("./routes/bidRoutes.js");
const setupSocket = require("./socket.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/basins", basinRoutes);
app.use("/api/bids", bidRoutes);

setupSocket(io);

// server.listen(3000, () => console.log("Server running on port 3000"));

console.log('Database URL:...................... ', process.env.DATABASE_URL);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sqlali14:BTHCy6HLDrqMUe7Y@cluster0.tctmr.mongodb.net/wala_DB?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    console.log(process.env.DATABASE_URL); // Check if DATABASE_URL is loaded correctly
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
