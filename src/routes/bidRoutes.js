const express = require("express");
const { getBids, placeBid, deleteBid,getAuctionBids } = require("../controllers/bidController");

const router = express.Router();
router.get("/", getBids);
router.post("/", placeBid);
router.get("/:id", getAuctionBids);
router.delete("/:id", deleteBid);

module.exports = router;
