const express = require("express");
const router = express.Router();
const pool = require("../db");

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

router.get("/", async (req, res) => {
  const { q, lat, lng, radius = 5 } = req.query;

  const result = await pool.query(`
    SELECT v.id, v.name, v.latitude, v.longitude,
           v.identity, v.behaviour, v.consistency, v.compliance,
           p.name AS product, p.price
    FROM vendors v
    JOIN products p ON p.vendor_id = v.id
    WHERE LOWER(p.name) LIKE LOWER($1)
  `, [`%${q}%`]);

  const data = result.rows
    .map(r => {
      const dist = haversine(+lat, +lng, r.latitude, r.longitude);
      const trust =
        0.4*r.identity + 0.3*r.behaviour + 0.2*r.consistency + 0.1*r.compliance;
      return {
        vendor: r.name,
        product: r.product,
        price: r.price,
        lat: r.latitude,
        lng: r.longitude,
        distance: dist,
        trust
      };
    })
    .filter(x => x.distance <= radius);

  res.json(data);
});

module.exports = router;
