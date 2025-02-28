const prisma = require("../prismaClient");
const { bidSchema } = require("../utils/validators");
const { createNotification, createMultipleNotifications } = require("./notificationController");

const getBids = async (req, res, next) => {
  try {
    const bids = await prisma.bid.findMany({ include: { user: true, auction: true } });
    res.json(bids);
  } catch (error) {
    next(error);
  }
};

const placeBid = async (req, res, next) => {
  try {
    const { userId, auctionId, amount } = bidSchema.parse(req.body);

    const auction = await prisma.auction.findUnique({ 
      where: { id: auctionId }, 
        include: { 
        bids: true,
        land: {
          include: { trader: true }
        }
      } 
    });
    if (!auction) return res.status(401).json("Auction not found");
    
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json("User not found");
    
    const highestBid = auction.bids.length ? Math.max(...auction.bids.map((b) => b.amount)) : auction.startPrice;
    if (amount <= highestBid)return res.status(401).json("Bid must be higher than current highest bid");

    const bid = await prisma.bid.create({ data:{ userId, auctionId, amount } });

    // Get all BROWSER1 users
    const browser1Users = await prisma.user.findMany({
      where: { role: "BROWSER1" }
    });

    // Create notifications for BROWSER1 users and trader
    await createMultipleNotifications({
      userIds: [...browser1Users.map(u => u.id), auction.land.traderId],
      auctionId,
      type: "NEW_BID",
      message: `New bid of ${amount} placed on land ${auction.land.name}`
    });

    res.status(201).json(bid);
  } catch (error) {
    next(error);
  }
};

const deleteBid = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.bid.delete({ where: { id } });

    res.json({ message: "Bid deleted" });
  } catch (error) {
    next(error);
  }
};

const getAuctionBids = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bids = await prisma.bid.findMany({ where: { auctionId: id }, include: { user: true, auction: true } });
    res.json(bids);
  } catch (error) {
    next(error);
  }
};

module.exports= { getBids, placeBid, deleteBid, getAuctionBids };
