const express = require("express");
const router = express.Router();

// Simulated on-chain trust-aware search
router.get("/", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);

  res.json([
    {
      product: q,
      vendor: "Sri Lakshmi Stores",
      vendorTrust: 84.5,
      onChain: true
    },
    {
      product: q,
      vendor: "Metro Electronics",
      vendorTrust: 67.5,
      onChain: true
    }
  ]);
});

module.exports = router;
