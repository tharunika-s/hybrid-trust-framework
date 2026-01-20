const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const q = req.query.q;

    let sql;
    let params = [];

    if (!q || q.trim() === "") {
      sql = `
        SELECT 
          p.name AS product,
          v.name AS vendor,
          v.identity,
          v.behaviour,
          v.consistency,
          v.compliance
        FROM products p
        JOIN vendors v ON p.vendor_id = v.id
        LIMIT 50
      `;
    } else {
      sql = `
        SELECT 
          p.name AS product,
          v.name AS vendor,
          v.identity,
          v.behaviour,
          v.consistency,
          v.compliance
        FROM products p
        JOIN vendors v ON p.vendor_id = v.id
        WHERE p.name ILIKE $1
      `;
      params.push(`%${q}%`);
    }

    const result = await pool.query(sql, params);

    // compute trust score dynamically
    const data = result.rows.map(r => ({
      product: r.product,
      vendor: r.vendor,
      vendorTrust:
        0.4 * r.identity +
        0.3 * r.behaviour +
        0.2 * r.consistency +
        0.1 * r.compliance,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
