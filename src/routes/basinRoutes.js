const express = require("express");
const { getBasins, createBasin, deleteBasin } = require("../controllers/basinController");

const router = express.Router();
router.get("/", getBasins);
router.post("/", createBasin);
router.delete("/:id", deleteBasin);

module.exports = router;
