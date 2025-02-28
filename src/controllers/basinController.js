const prisma = require("../prismaClient");
const fs = require('fs').promises;
const path = require('path');

const BASINS_DIR = path.join(__dirname, '..', '..', 'data', 'basins');

// Ensure basins directory exists
const ensureBasinsDir = async () => {
  try {
    await fs.mkdir(BASINS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating basins directory:', error);
  }
};

// Initialize basins directory
ensureBasinsDir();

const getBasinFilePath = (basinId) => path.join(BASINS_DIR, `${basinId}.json`);

const saveBasinToFile = async (basin, lands = []) => {
  const filePath = getBasinFilePath(basin.id);
  const basinData = {
    ...basin,
    lands,
    updatedAt: new Date().toISOString()
  };
  await fs.writeFile(filePath, JSON.stringify(basinData, null, 2));
};

const getBasins = async (req, res, next) => {
  try {
    const basins = await prisma.basin.findMany({ 
      include: { 
        lands: {
          include: {
            trader: true,
            auctions: {
              include: {
                bids: true
              }
            }
          }
        } 
      } 
    });

    // Update JSON files for each basin
    await Promise.all(basins.map(basin => saveBasinToFile(basin, basin.lands)));

    res.json(basins);
  } catch (error) {
    next(error);
  }
};

const createBasin = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new Error("Name is required");

    const basin = await prisma.basin.create({ 
      data: { name },
      include: { lands: true }
    });

    // Create JSON file for the new basin
    await saveBasinToFile(basin);

    res.status(201).json(basin);
  } catch (error) {
    next(error);
  }
};

const deleteBasin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete the basin's JSON file
    try {
      await fs.unlink(getBasinFilePath(id));
    } catch (error) {
      console.error('Error deleting basin file:', error);
    }

    await prisma.basin.delete({ where: { id } });

    res.json({ message: "Basin deleted" });
  } catch (error) {
    next(error);
  }
};

const updateBasinFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const basin = await prisma.basin.findUnique({
      where: { id },
      include: {
        lands: {
          include: {
            trader: true,
            auctions: {
              include: {
                bids: true
              }
            }
          }
        }
      }
    });

    if (!basin) {
      return res.status(404).json({ message: "Basin not found" });
    }

    await saveBasinToFile(basin, basin.lands);
    res.json({ message: "Basin file updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getBasins, 
  createBasin, 
  deleteBasin,
  updateBasinFile
};
