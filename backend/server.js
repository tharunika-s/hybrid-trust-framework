const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const vendorRoutes = require("./routes/vendors");
const searchRoutes = require("./routes/search");
const searchOnchainRoutes = require("./routes/searchOnchain");

// register routes
app.use("/vendors", vendorRoutes);
app.use("/search", searchRoutes);
app.use("/search/onchain", searchOnchainRoutes);

// root health check
app.get("/", (req, res) => {
  res.send("Hyperlocal Trust Backend Running");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
