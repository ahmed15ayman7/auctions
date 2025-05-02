const express = require("express");
const { getLands, createLand,deleteLand } = require("../controllers/landController");

const router = express.Router();
router.get("/", getLands);
router.post("/", createLand);
router.delete("/:id", deleteLand);

module.exports = router;
