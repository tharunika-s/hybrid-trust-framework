const express = require("express");
const router = express.Router();
const products = require("../data/products.json");

router.get("/search", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const result = products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  res.json(result);
});

module.exports = router;

