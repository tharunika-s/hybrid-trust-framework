const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ROUTES
const vendorRoutes = require("./routes/vendors");
const searchRoutes = require("./routes/search");
const searchOnchainRoutes = require("./routes/searchOnchain");

// REGISTER ROUTES
app.use("/vendors", vendorRoutes);
app.use("/search", searchRoutes);
app.use("/search/onchain", searchOnchainRoutes);

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("Hyperlocal Trust Backend Running");
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
