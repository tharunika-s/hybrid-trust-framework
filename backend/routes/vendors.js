const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all vendors with trust score
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vendors");

    const vendors = result.rows.map(v => ({
      ...v,
      trustScore:
        0.4 * v.identity +
        0.3 * v.behaviour +
        0.2 * v.consistency +
        0.1 * v.compliance,
    }));

    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
