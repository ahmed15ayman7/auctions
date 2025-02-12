const prisma = require("../prismaClient");
const { io } = require("../socket");

const getAuctions = async (req, res, next) => {
  try {
    const auctions = await prisma.auction.findMany({ include: { land: true, bids: true } });
    res.json(auctions);
  } catch (error) {
    next(error);
  }
};

const createAuction = async (req, res, next) => {
  try {
    const { landId, startPrice, endAt } = req.body;
    if (!landId || !startPrice || !endAt) throw new Error("All fields are required");

    const auction = await prisma.auction.create({
      data: { landId, startPrice, endAt: new Date(endAt) },
    });

    // Schedule auction end handler
    const endTime = new Date(endAt).getTime() - Date.now();
    setTimeout(() => handleAuctionEnd(auction.id), endTime);

    res.status(201).json(auction);
  } catch (error) {
    next(error);
  }
};

const deleteAuction = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.bid.deleteMany({ where: { auctionId: id } });
    await prisma.auction.delete({ where: { id } });

    res.json({ message: "Auction deleted" });
  } catch (error) {
    next(error);
  }
}

const handleAuctionEnd = async (auctionId) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
          include: { user: true }
        },
        land: {
          include: { trader: true }
        }
      }
    });

    if (!auction || auction.status === 'ENDED') return;

    const highestBid = auction.bids[0];
    
    // Update auction status and winner
    await prisma.auction.update({
      where: { id: auctionId },
      data: { 
        status: 'ENDED',
        winnerId: highestBid ? highestBid.userId : null
      }
    });

    if (highestBid) {
      // Notify winner
      io.to(highestBid.userId).emit("AUCTION_WON", {
        auctionId,
        message: `Congratulations! You won the auction for land ${auction.land.name} with a bid of ${highestBid.amount}`
      });

      // Notify trader
      io.to(auction.land.traderId).emit("AUCTION_ENDED", {
        auctionId,
        message: `Your auction for land ${auction.land.name} has ended. Winning bid: ${highestBid.amount} by ${highestBid.user.username}`
      });
    } else {
      // Notify trader - no bids case
      io.to(auction.land.traderId).emit("AUCTION_ENDED", {
        auctionId,
        message: `Your auction for land ${auction.land.name} has ended with no bids`
      });
    }
  } catch (error) {
    console.error('Error handling auction end:', error);
  }
};

// Add checkEndedAuctions function to handle auctions that ended while server was down
const checkEndedAuctions = async () => {
  try {
    const endedAuctions = await prisma.auction.findMany({
      where: {
        endAt: { lte: new Date() },
        status: 'ONGOING',
      }
    });

    for (const auction of endedAuctions) {
      await handleAuctionEnd(auction.id);
    }
  } catch (error) {
    console.error('Error checking ended auctions:', error);
  }
};

// Run checkEndedAuctions on server start and every hour
checkEndedAuctions();
setInterval(checkEndedAuctions, 60 * 60 * 1000);

module.exports = { 
  getAuctions, 
  createAuction, 
  deleteAuction,
  handleAuctionEnd,
  checkEndedAuctions
};