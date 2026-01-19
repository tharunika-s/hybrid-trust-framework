const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /search?q=rice
router.get("/", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query missing" });
  }

  const result = await pool.query(
    `
    SELECT 
      v.id as vendor_id,
      v.name as vendor,
      v.wallet,
      v.identity,
      v.behaviour,
      v.consistency,
      v.compliance,
      p.name as product,
      p.price
    FROM products p
    JOIN vendors v ON p.vendor_id = v.id
    WHERE LOWER(p.name) LIKE LOWER($1)
    `,
    [`%${q}%`]
  );

  const response = result.rows.map(r => {
    const trustScore =
      0.4 * r.identity +
      0.3 * r.behaviour +
      0.2 * r.consistency +
      0.1 * r.compliance;

    return {
      vendorId: r.vendor_id,
      vendor: r.vendor,
      wallet: r.wallet,
      product: r.product,
      price: r.price,
      trustScore: Number(trustScore.toFixed(1))
    };
  });

  res.json(response);
});

module.exports = router;
