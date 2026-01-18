const express = require("express");
const router = express.Router();
const vendors = require("../data/vendors.json");
const { calculateTrustScore } = require("../services/trustScore");

// Get all vendors with trust score
router.get("/", (req, res) => {
  const result = vendors.map(v => ({
    ...v,
    trustScore: calculateTrustScore(
      v.identity,
      v.social,
      v.consistency,
      v.documents
    )
  }));

  res.json(result);
});

// Get single vendor details
router.get("/:id", (req, res) => {
  const vendor = vendors.find(v => v.id == req.params.id);
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });

  vendor.trustScore = calculateTrustScore(
    vendor.identity,
    vendor.social,
    vendor.consistency,
    vendor.documents
  );

  res.json(vendor);
});

module.exports = router;

