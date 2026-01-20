const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim();

    let sql;
    let params = [];

    if (!q) {
      sql = `
        SELECT 
          p.name AS product,
          v.name AS vendor,
          (
            0.4 * v.identity +
            0.3 * v.behaviour +
            0.2 * v.consistency +
            0.1 * v.compliance
          ) AS "vendorTrust"
        FROM products p
        JOIN vendors v ON p.vendor_id = v.id
        ORDER BY "vendorTrust" DESC
        LIMIT 100;
      `;
    } else {
      sql = `
        SELECT 
          p.name AS product,
          v.name AS vendor,
          (
            0.4 * v.identity +
            0.3 * v.behaviour +
            0.2 * v.consistency +
            0.1 * v.compliance
          ) AS "vendorTrust"
        FROM products p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.name ILIKE $1
        ORDER BY "vendorTrust" DESC
        LIMIT 100;
      `;
      params = [`%${q}%`];
    }

    const { rows } = await db.query(sql, params);

    // 🔒 ALWAYS same shape
    res.json({
      success: true,
      count: rows.length,
      results: rows
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      success: false,
      results: []
    });
  }
});

module.exports = router;
