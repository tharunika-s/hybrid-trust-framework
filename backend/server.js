const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
const vendorRoutes = require("./routes/vendors");
const searchRoutes = require("./routes/search");

// REGISTER ROUTES (ONLY ONCE)
app.use("/vendors", vendorRoutes);
app.use("/search", searchRoutes);

// ROOT
app.get("/", (req, res) => {
  res.send("Hyperlocal Trust Backend Running");
});

// START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log("✅ Backend running on port", PORT);
});
