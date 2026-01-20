const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  console.log("➡️ /search called on Azure");

  try {
    const q = req.query.q;
    console.log("Query param:", q);

    let sql;
    let params = [];

    if (!q || q.trim() === "") {
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
        LIMIT 10;
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
        LIMIT 10;
      `;
      params = [`%${q}%`];
    }

    console.log("Executing SQL on Azure...");
    const { rows } = await db.query(sql, params);
    console.log("Rows returned:", rows.length);

    res.json(rows);
  } catch (err) {
    console.error("🔥 SEARCH ERROR ON AZURE:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
