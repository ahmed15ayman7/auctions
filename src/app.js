const express = require("express");
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

server.listen(3000, () => console.log("Server running on port 3000"));
