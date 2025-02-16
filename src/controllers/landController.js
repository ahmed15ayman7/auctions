const prisma = require("../prismaClient");

const getLands = async (req, res, next) => {
  try {
    const lands = await prisma.land.findMany({ include: { trader: true } });
    res.json(lands);
  } catch (error) {
    next(error);
  }
};

const createLand = async (req, res, next) => {
  try {
    const { basinId, traderId, name, neighborhood, location, priceBefore, priceAfter, ownerName, ownerPhone } =
      req.body;
    if (!basinId || !traderId || !name || !neighborhood || !location || !priceBefore || !priceAfter || !ownerName || !ownerPhone)
      throw new Error("All fields are required");

    const basin = await prisma.basin.findUnique({ where: { id: basinId } });
    if (!basin) throw new Error("Basin not found");

    const trader = await prisma.user.findUnique({ where: { id: traderId, role: "TRADER" } });
    if (!trader) throw new Error("Trader not found");

    const land = await prisma.land.create({
      data: { basinId, traderId, name, neighborhood, location, priceBefore, priceAfter, ownerName, ownerPhone },
    });

    res.status(201).json(land);
  } catch (error) {
    next(error);
  }
};

const deleteLand = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if the land exists
    const land = await prisma.land.findUnique({ where: { id } });
    if (!land) throw new Error("Land not found");

    await prisma.land.delete({ where: { id } });

    res.json({ message: "Land deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLands, createLand, deleteLand };
