const express = require("express");
const { getLands, createLand } = require("../controllers/landController");

const router = express.Router();
router.get("/", getLands);
router.post("/", createLand);

module.exports = router;
