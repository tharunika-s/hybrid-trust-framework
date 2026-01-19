const express = require("express");
const router = express.Router();
const pool = require("../db");

// /search?q=rice
router.get("/", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        v.id AS vendor_id,
        v.name AS vendor_name,
        v.trustscore
      FROM products p
      JOIN vendors v ON p.vendor_id = v.id
      WHERE LOWER(p.name) LIKE LOWER($1)
      `,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
