const express = require("express");
const { getAuctions, createAuction, deleteAuction } = require("../controllers/auctionController");

const router = express.Router();
router.get("/", getAuctions);
router.post("/", createAuction);
router.delete("/:id", deleteAuction);

module.exports = router;  
